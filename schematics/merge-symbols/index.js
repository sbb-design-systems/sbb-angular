'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var core = require('@angular-devkit/core');
var ts = _interopDefault(require('@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript'));

const IGNORED_FOLDERS = [
    '/src/angular/schematics/ng-add/test-cases/',
    '/src/angular/schematics/ng-generate/icon-cdn-provider/files',
];
function mergeSymbols() {
    return (tree) => {
        const symbols = {};
        extractExportsForModule('src/angular/');
        extractExportsForModule('src/angular-maps/');
        // TODO: sort by module path and then by key
        const sortedSymbols = Object.keys(symbols)
            .sort()
            .reduce((r, k) => ((r[k] = symbols[k]), r), {});
        // TODO: write to filesystem
        console.log(JSON.stringify(sortedSymbols, null, 4));
        function extractExportsForModule(rootPath) {
            tree.getDir(rootPath).visit((filePath, moduleDirEntry) => {
                if (!(moduleDirEntry && filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts')) ||
                    isInIgnoredFolders(filePath)) {
                    return;
                }
                const tsFile = ts.createSourceFile(filePath, moduleDirEntry.content.toString(), ts.ScriptTarget.Latest);
                tsFile.statements.filter(hasExportModifier).forEach((statement) => {
                    extractSymbolOfStatement(filePath, rootPath, statement);
                });
            });
        }
        function isInIgnoredFolders(filePath) {
            return IGNORED_FOLDERS.some((folder) => filePath.startsWith(folder));
        }
        function hasExportModifier(statement) {
            return (statement.modifiers &&
                statement.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
        }
        function extractSymbolOfStatement(filePath, rootPath, statement) {
            const modulePath = resolvePackageModule(filePath).replace('/' + rootPath, '');
            if (ts.isVariableStatement(statement)) {
                statement.declarationList.declarations
                    .map((declaration) => declaration.name)
                    .filter(ts.isIdentifier)
                    .map((identifier) => identifier.escapedText)
                    .forEach((name) => addToSymbols(name, modulePath));
            }
            else if (statement.name &&
                statement.name.kind === ts.SyntaxKind.Identifier) {
                const typedName = statement.name;
                addToSymbols(typedName.escapedText, modulePath);
            }
        }
        function resolvePackageModule(path) {
            let dir;
            if (!isDir(path)) {
                dir = parentDir(path);
            }
            else {
                dir = path;
            }
            const bazelFile = tree.getDir(dir).file('BUILD.bazel');
            if (bazelFile == null) {
                return resolvePackageModule(parentDir(dir));
            }
            return dir;
        }
        function isDir(path) {
            try {
                tree.getDir(path);
            }
            catch (e) {
                if (e instanceof core.PathIsFileException) {
                    return false;
                }
                else {
                    throw Error;
                }
            }
            return true;
        }
        function parentDir(path) {
            return path.split('/').slice(0, -1).join('/');
        }
        function addToSymbols(name, modulePath) {
            if (symbols[name] && symbols[name] !== modulePath) {
                console.warn(`symbol ${name} is already in list with value ${symbols[name]}. Tried to add ${modulePath}.`);
            }
            symbols[name] = modulePath;
        }
    };
}

exports.mergeSymbols = mergeSymbols;
