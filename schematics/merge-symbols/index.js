'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');
var ts = require('@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ts__default = /*#__PURE__*/_interopDefaultLegacy(ts);

const IGNORED_FOLDERS = ['/src/angular/schematics/ng-add/test-cases/'];
function mergeSymbols() {
    return (tree) => {
        // Initialize collection with deprecated symbols (re-exports)
        let symbols = {
            SbbOptionGroup: 'core',
            SbbLinksModule: 'button',
            SbbLink: 'button',
            SbbContextmenuModule: 'menu',
            SbbDropdown: 'menu',
            SbbDropdownSelectedEvent: 'menu',
            getSbbDropdownMissingPanelError: 'menu',
            SBB_DROPDOWN_SCROLL_STRATEGY: 'menu',
            SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY: 'menu',
            SBB_DROPDOWN_OPTION_HEIGHT: 'menu',
            SBB_DROPDOWN_PANEL_HEIGHT: 'menu',
            SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER: 'menu',
            SbbDropdownTrigger: 'menu',
            SbbDropdownOrigin: 'menu',
            SbbDropdownSelectionChange: 'menu',
            SbbDropdownParent: 'menu',
            SBB_DROPDOWN_ITEM_PARENT_COMPONENT: 'menu',
            getDropdownItemScrollPosition: 'menu',
            SbbDropdownItem: 'menu',
            SbbDropdownModule: 'menu',
            SbbDropdownDefaultOptions: 'menu',
            SbbBusinessDateAdapter: 'core',
            SBB_BUSINESS_DATE_ADAPTER: 'core',
            SbbChipInputChange: 'chips',
            SbbChipModule: 'chips',
            SbbPaginatorComponent: 'pagination',
            SbbPageChangeEvent: 'pagination',
            SbbPagination: 'pagination',
            SbbTabs: 'tabs',
        };
        extractExportsForModule('src/angular/');
        extractExportsForModule('src/angular-maps/');
        sortSymbols();
        tree.overwrite('/src/angular/schematics/ng-add/migrations/sbb-angular-symbols.json', JSON.stringify(symbols, null, 2));
        function extractExportsForModule(rootPath) {
            tree.getDir(rootPath).visit((filePath, moduleDirEntry) => {
                if (!(moduleDirEntry && filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts')) ||
                    isInIgnoredFolders(filePath)) {
                    return;
                }
                const tsFile = ts__default['default'].createSourceFile(filePath, moduleDirEntry.content.toString(), ts__default['default'].ScriptTarget.Latest);
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
                statement.modifiers.some((modifier) => modifier.kind === ts__default['default'].SyntaxKind.ExportKeyword));
        }
        function extractSymbolOfStatement(filePath, rootPath, statement) {
            const modulePath = resolvePackageModule(filePath).replace('/' + rootPath, '');
            if (ts__default['default'].isVariableStatement(statement)) {
                statement.declarationList.declarations
                    .map((declaration) => declaration.name)
                    .filter(ts__default['default'].isIdentifier)
                    .map((identifier) => identifier.escapedText)
                    .forEach((name) => addToSymbols(name, modulePath));
            }
            else if (statement.name &&
                statement.name.kind === ts__default['default'].SyntaxKind.Identifier) {
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
        function sortSymbols() {
            symbols = Object.entries(symbols)
                .sort(([a], [b]) => a.localeCompare(b)) // sort by key
                .sort(([, a], [, b]) => a.localeCompare(b)) // sort by value
                .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        }
    };
}

exports.mergeSymbols = mergeSymbols;
