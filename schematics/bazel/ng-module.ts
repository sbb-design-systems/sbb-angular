import { basename, fragment, join, Path, relative, split } from '@angular-devkit/core';
import {
  apply,
  DirEntry,
  FileEntry,
  forEach,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import {
  createSourceFile,
  ExportDeclaration,
  ImportDeclaration,
  ScriptTarget,
  SyntaxKind
} from 'typescript';

import { SassBinary } from './sass-binary';

export class NgModule {
  path: Path;
  name: string;
  moduleName: string;
  hasMarkdown: boolean;
  dependencies: string[];
  hasTests: boolean;
  testDependencies: string[];
  hasSassLibrary: boolean;
  sassBinaries: SassBinary[];
  stylesheets: string[];
  customTsConfig = '';

  protected _templateUrl = './files/ngModule';
  protected _markdownFiles: FileEntry[] = [];
  protected _tsFiles: FileEntry[] = [];
  protected _htmlFiles: FileEntry[] = [];

  private _specFiles: FileEntry[] = [];
  private _scssFiles: FileEntry[] = [];
  private _scssLibaryFiles: FileEntry[] = [];
  private _modules: NgModule[] = [];

  constructor(private _dir: DirEntry, protected _tree: Tree, protected _context: SchematicContext) {
    this.path = this._dir.path;
    this._findFiles(this._dir);
    this.name = basename(this.path);
    const packageName = split(this.path)[2];
    const moduleName = relative(this._tree.getDir('src').dir(packageName).path, this.path);
    this.moduleName = `@sbb-esta/angular-${packageName}/${moduleName}`;
    this.hasMarkdown = this._dir.subfiles.includes(fragment(`${basename(this.path)}.md`));
    this.dependencies = this._findDependencies();
    this.hasTests = !!this._specFiles.length;
    this.testDependencies = this.hasTests ? this._findTestDependencies() : [];
    this.hasSassLibrary = !!this._scssLibaryFiles.length;
    this.sassBinaries = this._findSassBinaries();
    this.stylesheets = this.sassBinaries.map(s => s.path.replace('.scss', '.css'));
  }

  ngModules(): NgModule[] {
    return this._modules.reduce((current, next) => current.concat(next.ngModules()), [
      this
    ] as NgModule[]);
  }

  render(): Rule[] {
    return this._modules.reduce((current, next) => current.concat(next.render()), [
      mergeWith(
        apply(url(this._templateUrl), [
          template(this._templateOptions()),
          move(this.path),
          forEach(fileEntry => {
            if (this._tree.exists(fileEntry.path)) {
              this._tree.overwrite(fileEntry.path, fileEntry.content);
              return null;
            }
            return fileEntry;
          })
        ])
      )
    ]);
  }

  protected _templateOptions() {
    return this;
  }

  protected _isModuleDir(dir: DirEntry) {
    return dir.subfiles.includes(fragment('public-api.ts'));
  }

  protected _createSubModule(dir: DirEntry) {
    return new NgModule(dir, this._tree, this._context);
  }

  protected _resolveTsImport(importPath: string, _fileEntry: FileEntry) {
    if (importPath.startsWith('@sbb-esta/')) {
      return importPath.replace('@sbb-esta/angular-', '//src/');
    } else if (importPath.startsWith('.')) {
      return '';
    } else {
      return this._toNodeDependency(importPath);
    }
  }

  private _findFiles(dir: DirEntry, skipModuleCheck = true) {
    if (['schematics', 'styles'].some(d => basename(dir.path) === d)) {
      return;
    } else if (!skipModuleCheck && this._isModuleDir(dir)) {
      this._modules.push(this._createSubModule(dir));
      return;
    }

    for (const file of dir.subfiles) {
      if (file.endsWith('.spec.ts')) {
        this._specFiles.push(dir.file(file)!);
      } else if (file.endsWith('.ts')) {
        this._tsFiles.push(dir.file(file)!);
      } else if (file.endsWith('.md')) {
        this._markdownFiles.push(dir.file(file)!);
      } else if (file.endsWith('.html')) {
        this._htmlFiles.push(dir.file(file)!);
      } else if (file.endsWith('.scss') && file.startsWith('_')) {
        this._scssLibaryFiles.push(dir.file(file)!);
      } else if (file.endsWith('.scss')) {
        this._scssFiles.push(dir.file(file)!);
      }
    }

    dir.subdirs.forEach(d => this._findFiles(dir.dir(d), false));
  }

  private _findDependencies() {
    const dependencies = this._tsFiles
      .reduce((current, f) => current.concat(this._findImportsAndReexports(f)), [] as string[])
      .filter((v, i, a) => a.indexOf(v) === i);
    if (this.path.includes('src/maps/')) {
      dependencies.push('@npm//@types/arcgis-js-api');
    } else if (this.path.includes('captcha')) {
      dependencies.push('@npm//@types/grecaptcha');
    }

    return dependencies.sort();
  }

  private _findTestDependencies() {
    return this._specFiles
      .reduce((current, f) => current.concat(this._findImportsAndReexports(f)), [] as string[])
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter(i => !this.dependencies.includes(i))
      .sort();
  }

  private _findImportsAndReexports(fileEntry: FileEntry) {
    const file = createSourceFile(
      basename(fileEntry.path),
      fileEntry.content.toString(),
      ScriptTarget.ESNext,
      true
    );
    return findNodes(file, SyntaxKind.ImportDeclaration, undefined, true)
      .concat(findNodes(file, SyntaxKind.ExportDeclaration, undefined, true))
      .map(
        (n: ImportDeclaration | ExportDeclaration) =>
          n.moduleSpecifier?.getText().replace(/['"]/g, '') ?? ''
      )
      .map(i => this._resolveTsImport(i, fileEntry))
      .filter(i => !!i);
  }

  private _findSassBinaries() {
    return this._scssFiles
      .filter(f => f.path.endsWith('.scss') && !basename(f.path).startsWith('_'))
      .map(file => {
        const stylesheetPath = relative(this.path, file.path);
        return {
          name: stylesheetPath.replace(/[^a-z0-9]/g, '_'),
          path: stylesheetPath,
          dependencies: this._findStylesheetDependencies(file)
        };
      });
  }

  private _findStylesheetDependencies(entry: FileEntry) {
    const matches = entry.content.toString().match(/@import '([^']+)';/g);
    if (!matches) {
      return [];
    }
    return matches
      .map(s => s.substring(9, s.length - 2))
      .map(importPath => {
        if (importPath.includes('/core/styles/common')) {
          return '//src/core/styles:common_scss_lib';
        } else if (this._isInModule(join(entry.path, importPath))) {
          return `:${basename(this.path)}_scss_lib`;
        } else if (importPath.includes('/node_modules/')) {
          return this._toNodeDependency(importPath.split('/node_modules/')[1]);
        } else if (importPath.includes('~')) {
          return this._toNodeDependency(importPath.split('~')[1]);
        } else {
          this._context.logger.warn(
            `${entry.path}: Could not resolve stylesheet import '${importPath}'`
          );
          return '';
        }
      })
      .filter(d => !!d)
      .filter((v, i, a) => a.indexOf(v) === i);
  }

  private _isInModule(path: Path): boolean {
    return !relative(this.path, path).startsWith('..');
  }

  private _toNodeDependency(importPath: string) {
    const index = importPath.startsWith('@') ? 2 : 1;
    return `@npm//${importPath.split('/', index).join('/')}`;
  }
}
