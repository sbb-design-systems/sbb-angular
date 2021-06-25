import {
  DevkitContext,
  Migration,
  ResolvedResource,
  TargetVersion,
  WorkspacePath,
} from '@angular/cdk/schematics';
import { dirname, relative } from 'path';
import * as ts from 'typescript';

interface Replacement {
  replace: string;
  replaceWith: string;
  sourceFile: ts.SourceFile;
}

// TODO: Remove once no longer needed.
export class PrefixMigration extends Migration<any, DevkitContext> {
  enabled: boolean = this.targetVersion === TargetVersion.V11;
  private _replacements: Replacement[] = [];
  private _identifiers = new Map<string, ts.Identifier[]>();

  /** Method can be used to perform global analysis of the program. */
  init(): void {}

  /**
   * Method that will be called for each node in a given source file. Unlike tslint, this
   * function will only retrieve TypeScript nodes that need to be casted manually. This
   * allows us to only walk the program source files once per program and not per
   * migration rule (significant performance boost).
   */
  visitNode(node: ts.Node): void {
    if (ts.isIdentifier(node)) {
      const identifiers = this._identifiers.get(node.getText()) || [];
      if (!identifiers.includes(node)) {
        identifiers.push(node);
      }
      this._identifiers.set(node.getText(), identifiers);
    }
    const fileName = node.getSourceFile().fileName;
    if (
      !fileName.match(/src\/angular-/) ||
      [
        'angular-icons',
        'angular-keycloak',
        '.spec.ts',
        'breakpoints',
        'common-behaviors',
        'schematics',
        'testing',
        'oauth',
      ].some((k) => fileName.includes(k)) ||
      !node.modifiers ||
      node.modifiers.every((m) => m.kind && m.kind !== ts.SyntaxKind.ExportKeyword)
    ) {
      return;
    }

    if (
      (ts.isClassDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)) &&
      this._hasExportModifier(node)
    ) {
      this._visitClassOrInterfaceOrTypeAliasDeclaration(node);
    } else if (ts.isFunctionDeclaration(node) && this._hasExportModifier(node)) {
      this._visitFunctionOrVariableDeclaration(node);
    } else if (ts.isVariableStatement(node) && this._hasExportModifier(node)) {
      this._visitFunctionOrVariableDeclaration(node.declarationList.declarations[0]);
    }
  }

  private _visitClassOrInterfaceOrTypeAliasDeclaration(
    node: ts.ClassDeclaration | ts.InterfaceDeclaration | ts.TypeAliasDeclaration
  ) {
    const text = node.name!.getText();
    if (text.startsWith('Sbb')) {
      return;
    }

    if (text.startsWith('IconDirective')) {
      this._replace(text, `Sbb${text}`, node);
    } else if (text.startsWith('SBB')) {
      this._replace(text, `Sbb${text.substring(3).replace(/(Directive|Component)$/, '')}`, node);
    } else {
      this._replace(text, `Sbb${text.replace(/(Directive|Component)$/, '')}`, node);
    }
  }

  private _visitFunctionOrVariableDeclaration(
    node: ts.FunctionDeclaration | ts.VariableDeclaration
  ) {
    const text = node.name!.getText();
    if (['get', 'SBB', 'sbb', 'Sbb', 'throw', 'create'].some((k) => text.startsWith(k))) {
      return;
    }

    if (text.match(/^[A-Z0-9\_]+$/)) {
      this._replace(text, `SBB_${text}`, node);
    } else {
      this._replace(text, `sbb${text.charAt(0).toUpperCase()}${text.slice(1)}`, node);
    }
  }

  private _hasExportModifier(node: ts.Node) {
    return (
      node.modifiers && node.modifiers!.some((m) => m && m.kind === ts.SyntaxKind.ExportKeyword)
    );
  }

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(_template: ResolvedResource): void {}

  /** Method that will be called for each stylesheet in the program. */
  visitStylesheet(_stylesheet: ResolvedResource): void {}

  /**
   * Method that will be called once all nodes, templates and stylesheets
   * have been visited.
   */
  postAnalysis(): void {
    const replacements = this._replacements
      .filter((v, i, a) => a.findIndex((vi) => vi.replace === v.replace) === i)
      .sort((a, b) => a.replace.localeCompare(b.replace));
    const classNamesPath = this.fileSystem.resolve(
      'src/angular-core/schematics/ng-update/data/class-names.ts'
    );
    const classNamesContent = this.fileSystem.read(classNamesPath)!;
    const classNamesRecorder = this.fileSystem.edit(classNamesPath);
    const classNamesInsert = replacements.reduce(
      (current, next) =>
        `${current}\n        { replace: '${next.replace}', replaceWith: '${next.replaceWith}' },`,
      ''
    );
    const insertIndex =
      classNamesContent.indexOf(',', classNamesContent.lastIndexOf('replaceWith')) + 1;
    classNamesRecorder.insertRight(insertIndex, classNamesInsert);

    for (const { replace, replaceWith } of replacements) {
      const identifiers = this._identifiers.get(replace);
      if (identifiers?.length) {
        for (const identifier of identifiers) {
          const filePath = this.fileSystem.resolve(identifier.getSourceFile().fileName);
          const recorder = this.fileSystem.edit(filePath);
          recorder.remove(identifier.getStart(), identifier.getEnd() - identifier.getStart());
          recorder.insertRight(identifier.getStart(), replaceWith);
        }
      }
    }

    const moduleReplacementMap = new Map<WorkspacePath, Replacement[]>();
    for (const replacement of this._replacements) {
      const publicApi = this._findPublicApiFile(replacement.sourceFile.fileName);
      const moduleFiles = moduleReplacementMap.get(publicApi) || [];
      moduleFiles.push(replacement);
      moduleReplacementMap.set(publicApi, moduleFiles);
    }

    moduleReplacementMap.forEach((moduleReplacements, publicApi) => {
      const fileReplacementMap = new Map<string, Replacement[]>();
      for (const replacement of moduleReplacements) {
        const relativePath = `./${relative(dirname(publicApi), replacement.sourceFile.fileName)
          .replace(/\\/g, '/')
          .replace(/\.ts$/, '')}`;
        const fileReplacement = fileReplacementMap.get(relativePath) || [];
        fileReplacement.push(replacement);
        fileReplacementMap.set(relativePath, fileReplacement);
      }

      const reExports = Array.from(fileReplacementMap)
        .map(([path, fileReplacements]) => {
          const renames = fileReplacements
            .map((r) => `${r.replaceWith} as ${r.replace}`)
            .join(', ');
          return `/** @deprecated Remove with v12 */\nexport { ${renames} } from '${path}';\n`;
        })
        .join('');
      const publicApiContent = this.fileSystem.read(publicApi);
      const recorder = this.fileSystem.edit(publicApi);
      recorder.insertRight(publicApiContent!.length, reExports);
    });
  }

  private _replace(replace: string, replaceWith: string, node: ts.Node) {
    this._replacements.push({
      replace,
      replaceWith,
      sourceFile: node.getSourceFile(),
    });
  }

  private _findPublicApiFile(fileName: string) {
    while (fileName) {
      const dir = dirname(fileName);
      const publicApi = this.fileSystem.resolve(fileName, 'public-api.ts');
      if (this.fileSystem.fileExists(publicApi)) {
        return publicApi;
      }
      fileName = dir;
    }

    throw new Error('Could not find public-api.ts');
  }
}
