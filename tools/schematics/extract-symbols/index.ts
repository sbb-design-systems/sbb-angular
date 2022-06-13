import { Path, PathFragment, PathIsFileException } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

const IGNORED_FOLDERS = ['/src/angular/schematics/ng-update/test-cases/'];

export function extractSymbols(): Rule {
  return (tree: Tree) => {
    // Initialize collection with deprecated symbols (re-exports)
    let symbols: { [key: string]: string } = {};

    extractExportsForModule('src/angular/');
    sortSymbols();

    tree.overwrite(
      '/src/angular/schematics/ng-update/migrations/sbb-angular-symbols.json',
      JSON.stringify(symbols, null, 2)
    );

    function extractExportsForModule(rootPath: string) {
      tree.getDir(rootPath).visit((filePath, moduleDirEntry) => {
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
          extractSymbolOfStatement(filePath, rootPath, statement);
        });
      });
    }

    function isInIgnoredFolders(filePath: Path) {
      return IGNORED_FOLDERS.some((folder) => filePath.startsWith(folder));
    }

    function hasExportModifier(statement: ts.Statement) {
      return (
        statement.modifiers &&
        statement.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      );
    }

    function extractSymbolOfStatement(filePath: Path, rootPath: string, statement: ts.Statement) {
      const modulePath = resolvePackageModule(filePath).replace('/' + rootPath, '');

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
    }

    function resolvePackageModule(path: string): string {
      let dir;

      if (!isDir(path)) {
        dir = parentDir(path);
      } else {
        dir = path;
      }

      const bazelFile = tree.getDir(dir).file('BUILD.bazel' as PathFragment);
      if (bazelFile == null) {
        return resolvePackageModule(parentDir(dir));
      }

      return dir;
    }

    function isDir(path: string) {
      try {
        tree.getDir(path);
      } catch (e) {
        if (e instanceof PathIsFileException) {
          return false;
        } else {
          throw Error;
        }
      }
      return true;
    }

    function parentDir(path: string) {
      return path.split('/').slice(0, -1).join('/');
    }

    function addToSymbols(name: string, modulePath: string) {
      if (symbols[name] && symbols[name] !== modulePath) {
        console.warn(
          `symbol ${name} is already in list with value ${symbols[name]}. Tried to add ${modulePath}.`
        );
      }
      symbols[name] = modulePath;
    }

    function sortSymbols() {
      symbols = Object.entries(symbols)
        .sort(([a], [b]) => a.localeCompare(b)) // sort by key
        .sort(([, a], [, b]) => a.localeCompare(b)) // sort by value
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    }
  };
}
