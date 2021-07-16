import { basename, dirname, join, Path, relative } from '@angular-devkit/core';
import { DirEntry, FileEntry, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as schematicsTs from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';

import { BazelModuleDetector } from './bazel-module-detector';
import { NpmDependencyResolver } from './npm-dependency-resolver';

export interface TypeScriptDependencyResolver {
  resolveDependencies(
    files: FileEntry[],
    dependencyBlocklist?: string[]
  ): TypeScriptDependencyResult;
}

export interface TypeScriptDependencyResult {
  dependencies: string[];
  files: string[];
}

export interface TypeScriptDependencyImportCheck {
  file: FileEntry;
  files: FileEntry[];
  importPath: string;
  importFilePath: Path;
  moduleBaseDir: DirEntry;
  importFileModuleBaseDir: DirEntry;
}

export abstract class TypeScriptDependencyResolverBase implements TypeScriptDependencyResolver {
  constructor(
    protected readonly _config: {
      organization: string;
      srcRoot: string;
      tree: Tree;
      moduleDetector: BazelModuleDetector;
      npmDependencyResolver: NpmDependencyResolver;
      dependencyByOccurence?: Map<string, string>;
    }
  ) {}

  resolveDependencies(
    files: FileEntry[],
    dependencyBlocklist: string[] = []
  ): TypeScriptDependencyResult {
    const result: TypeScriptDependencyResult = { dependencies: [], files: [] };
    for (const file of files) {
      this._findFileDependencies({ file, files }).forEach((fileResult) => {
        result.dependencies.push(...(fileResult.dependencies || []));
        result.files.push(...(fileResult.files || []));
      });
    }

    result.dependencies = result.dependencies
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter((d) => !dependencyBlocklist.includes(d))
      .sort();
    result.files = result.files.filter((v, i, a) => a.indexOf(v) === i).sort();

    return result;
  }

  private _findFileDependencies(details: {
    file: FileEntry;
    files: FileEntry[];
  }): Partial<TypeScriptDependencyResult>[] {
    return this._findStaticDependencies(details).concat(
      this._findDependencyByOccurrence(details.file)
    );
  }

  private _findStaticDependencies(details: { file: FileEntry; files: FileEntry[] }) {
    const sourceFile = schematicsTs.createSourceFile(
      basename(details.file.path),
      details.file.content.toString(),
      schematicsTs.ScriptTarget.ESNext,
      true
    );
    return this._findImportsAndReexports(sourceFile)
      .concat(this._findDynamicImports(sourceFile))
      .concat(this._findReferences(sourceFile))
      .filter((i) => !!i)
      .map((importPath) => this._resolveTypeScriptImport({ importPath, ...details }));
  }

  private _findImportsAndReexports(sourceFile: schematicsTs.SourceFile) {
    return [
      ...findNodes(sourceFile, schematicsTs.SyntaxKind.ImportDeclaration, undefined, true),
      ...findNodes(sourceFile, schematicsTs.SyntaxKind.ExportDeclaration, undefined, true),
    ].map(
      (n: schematicsTs.ImportDeclaration | schematicsTs.ExportDeclaration) =>
        n.moduleSpecifier?.getText().replace(/['"]/g, '') ?? ''
    );
  }

  private _findDynamicImports(sourceFile: schematicsTs.SourceFile) {
    return findNodes(sourceFile, schematicsTs.SyntaxKind.ImportKeyword, undefined, true)
      .filter(
        (n) =>
          n.getFullText().match(/ import/) &&
          schematicsTs.isCallExpression(n.parent) &&
          schematicsTs.isStringLiteral(n.parent.arguments[0])
      )
      .map((n) =>
        (n.parent as schematicsTs.CallExpression).arguments[0].getText().replace(/['"]/g, '')
      );
  }

  private _findReferences(sourceFile: schematicsTs.SourceFile) {
    return sourceFile.typeReferenceDirectives
      .map((d) => this._config.npmDependencyResolver.resolvePackageNames(d.fileName))
      .reduce((cur, next) => cur.concat(next), [] as string[]);
  }

  private _findDependencyByOccurrence(fileEntry: FileEntry): Partial<TypeScriptDependencyResult> {
    if (!this._config.dependencyByOccurence) {
      return {};
    }

    const content = fileEntry.content.toString();
    return {
      dependencies: Array.from(this._config.dependencyByOccurence!.keys())
        .filter((k) => content.includes(k))
        .map((k) => this._config.dependencyByOccurence!.get(k)!),
    };
  }

  private _resolveTypeScriptImport({
    importPath,
    file,
    files,
  }: {
    importPath: string;
    file: FileEntry;
    files: FileEntry[];
  }): Partial<TypeScriptDependencyResult> {
    if (importPath.startsWith(`${this._config.organization}/`)) {
      return {
        dependencies: [
          importPath.replace(`${this._config.organization}/`, `//${this._config.srcRoot}/`),
        ],
      };
    } else if (importPath.startsWith('.')) {
      const moduleBaseDir = this._config.moduleDetector.findModuleBaseDirectory(file.path);
      const importFilePath = join(dirname(file.path), importPath.replace(/(\.ts)?$/, '.ts'));
      const importFileModuleBaseDir =
        this._config.moduleDetector.findModuleBaseDirectory(importFilePath);
      return this._resolveRelativeImport({
        file,
        files,
        importPath,
        importFilePath,
        moduleBaseDir,
        importFileModuleBaseDir,
      });
    } else {
      return {
        dependencies: this._config.npmDependencyResolver
          .resolvePackageNames(importPath)
          .map((d) => this._config.npmDependencyResolver.toBazelNodeDependency(d)),
      };
    }
  }

  protected abstract _resolveRelativeImport(
    details: TypeScriptDependencyImportCheck
  ): Partial<TypeScriptDependencyResult>;
}

export class StrictModuleTypeScriptDependencyResolver extends TypeScriptDependencyResolverBase {
  protected _resolveRelativeImport({
    file,
    importFileModuleBaseDir,
    importFilePath,
    moduleBaseDir,
    importPath,
    files,
  }: TypeScriptDependencyImportCheck): Partial<TypeScriptDependencyResult> {
    if (importFileModuleBaseDir.path !== moduleBaseDir.path) {
      console.log(importFileModuleBaseDir.path);
      console.log(moduleBaseDir.path);
      throw new SchematicsException(
        `Import ${importPath} in ${file.path} escapes Bazel module boundary!`
      );
    } else if (files.every((f) => f.path !== importFilePath)) {
      return { files: [relative(moduleBaseDir.path, importFilePath)] };
    }

    return {};
  }
}

export class RelativeModuleTypeScriptDependencyResolver extends TypeScriptDependencyResolverBase {
  protected _resolveRelativeImport({
    importFileModuleBaseDir,
    importFilePath,
    moduleBaseDir,
    files,
  }: TypeScriptDependencyImportCheck): Partial<TypeScriptDependencyResult> {
    if (importFileModuleBaseDir.path !== moduleBaseDir.path) {
      return { dependencies: [`/${importFileModuleBaseDir.path}`] };
    } else if (files.every((f) => f.path !== importFilePath)) {
      return { files: [relative(moduleBaseDir.path, importFilePath)] };
    }

    return {};
  }
}
