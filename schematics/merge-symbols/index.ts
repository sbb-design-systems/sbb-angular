import { Path } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

const IGNORED_FOLDERS = [
  '/src/angular/schematics/ng-add/test-cases/',
  '/src/angular/schematics/ng-generate/icon-cdn-provider/files',
];

export function mergeSymbols(): Rule {
  return (tree: Tree) => {
    const symbols: { [key: string]: string } = {};

    tree.getDir(`src/angular`).visit((filePath, moduleDirEntry) => {
      if (
        !(moduleDirEntry && filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts')) ||
        isInIgnoredFolders(filePath)
      ) {
        return;
      }

      const tsFile = ts.createSourceFile(
        filePath,
        moduleDirEntry.content.toString(),
        ts.ScriptTarget.Latest
      );

      tsFile.statements.filter(hasExportModifier).forEach((statement) => {
        const modulePath = filePath; // TODO: resolve filePath

        if (ts.isVariableStatement(statement)) {
          statement.declarationList.declarations
            .map((declaration) => declaration.name)
            .filter(ts.isIdentifier)
            .map((identifier) => identifier.escapedText)
            .forEach((name) => addToSymbols(name as string, modulePath));
        } else if (
          (statement as ts.DeclarationStatement).name &&
          (statement as ts.DeclarationStatement).name!.kind === ts.SyntaxKind.Identifier
        ) {
          const typedName = (statement as ts.DeclarationStatement).name! as ts.Identifier;
          addToSymbols(typedName.escapedText as string, modulePath);
        }
      });
    });

    // TODO: sort by module path and then by key
    const sortedSymbols = Object.keys(symbols)
      .sort()
      .reduce((r: { [key: string]: string }, k) => ((r[k] = symbols[k]), r), {});

    // TODO: write to filesystem
    console.log(sortedSymbols);

    function hasExportModifier(statement: ts.Statement) {
      return (
        statement.modifiers &&
        statement.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      );
    }

    function addToSymbols(name: string, modulePath: string) {
      if (symbols[name] && symbols[name] !== modulePath) {
        console.warn(
          `symbol ${name} is already in list with value ${symbols[name]}. Tried to add ${modulePath}.`
        );
      }
      symbols[name] = modulePath;
    }

    function isInIgnoredFolders(filePath: Path) {
      return IGNORED_FOLDERS.some((folder) => filePath.startsWith(folder));
    }
  };
}
