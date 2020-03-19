'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');
var schematics = require('@angular-devkit/schematics');
var astUtils = require('@schematics/angular/utility/ast-utils');
var typescript = require('typescript');

function bazel() {
    return async (tree, context) => {
        const srcDir = tree.getDir('src');
        return schematics.chain(srcDir.subdirs
            .filter(d => !d.startsWith('showcase'))
            .map(d => srcDir.dir(d))
            .map(projectDir => {
            const ngModules = findNgModules(projectDir);
            return ngModules.map(m => ngModule(m)).concat(ngPackage(projectDir, ngModules));
        })
            .reduce((current, next) => current.concat(next), []));
        function findNgModules(dir) {
            const directories = dir.subdirs.map(d => dir.dir(d));
            const modules = directories.filter(d => d.subfiles.includes(core.fragment('public-api.ts')));
            return directories
                .map(d => findNgModules(d))
                .reduce((current, next) => current.concat(next), modules);
        }
        function ngModule(dir) {
            const dependencies = aggregateModuleImports(dir);
            const testDependencies = aggregateModuleImports(dir, false).filter(i => !dependencies.includes(i));
            return schematics.mergeWith(schematics.apply(schematics.url('./files/ngModule'), [
                schematics.template({
                    name: core.basename(dir.path),
                    // tslint:disable-next-line: no-non-null-assertion
                    packageName: core.basename(dir.parent.path),
                    hasMarkdown: moduleHasMarkdown(dir),
                    dependencies,
                    testDependencies,
                    hasTests: moduleHasTests(dir),
                    ...findStylesheets(dir)
                }),
                schematics.move(dir.path),
                overwriteIfExists()
            ]));
        }
        function aggregateModuleImports(dir, excludeTests = true) {
            const imports = [];
            dir.visit((path, entry) => {
                if (path.endsWith('.ts') &&
                    (!excludeTests || !path.endsWith('.spec.ts')) &&
                    isInSameModule(dir, path) &&
                    entry) {
                    for (const importPath of findImportsAndReexports(path, entry).map(convertToDependency)) {
                        if (importPath && !imports.includes(importPath) && importPath !== `/${dir.path}`) {
                            imports.push(importPath);
                        }
                    }
                }
            });
            return imports.sort();
        }
        function isInSameModule(dir, path) {
            const directoryParts = core.split(core.dirname(core.relative(dir.path, path)));
            for (const part of directoryParts) {
                dir = dir.dir(part);
                if (dir.subfiles.includes(core.fragment('public-api.ts'))) {
                    return false;
                }
            }
            return true;
        }
        function findImportsAndReexports(path, entry) {
            const file = typescript.createSourceFile(core.basename(path), entry.content.toString(), typescript.ScriptTarget.ESNext, true);
            return astUtils.findNodes(file, typescript.SyntaxKind.ImportDeclaration, undefined, true)
                .concat(astUtils.findNodes(file, typescript.SyntaxKind.ExportDeclaration, undefined, true))
                .map((n) => { var _a, _b; return (_b = (_a = n.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.getText().replace(/['"]/g, '')) !== null && _b !== void 0 ? _b : ''; });
        }
        function convertToDependency(importPath) {
            if (importPath.startsWith('@sbb-esta/')) {
                return importPath.replace('@sbb-esta/angular-', '//src/');
            }
            else if (importPath.startsWith('.')) {
                return '';
            }
            else {
                const index = importPath.startsWith('@') ? 2 : 1;
                return `@npm//${importPath.split('/', index).join('/')}`;
            }
        }
        function findStylesheets(dir) {
            const stylesheets = [];
            const sassBinaries = [];
            let hasSassLibrary = false;
            dir.visit((path, entry) => {
                if (!path.endsWith('.scss') || !entry) {
                    return;
                }
                else if (core.basename(path).startsWith('_')) {
                    hasSassLibrary = true;
                }
                else {
                    const stylesheetPath = core.relative(dir.path, path);
                    stylesheets.push(stylesheetPath.replace('.scss', '.css'));
                    sassBinaries.push({
                        name: stylesheetPath.replace(/[^a-z0-9]/g, '_'),
                        path: stylesheetPath,
                        dependencies: findStylesheetDependencies(dir, entry)
                    });
                }
            });
            return { stylesheets, sassBinaries, hasSassLibrary };
        }
        function findStylesheetDependencies(dir, entry) {
            const matches = entry.content.toString().match(/@import '([^']+)';/g);
            if (!matches) {
                return [];
            }
            return matches
                .map(s => s.substring(9, s.length - 2))
                .map(i => {
                if (i.includes('/core/styles/common')) {
                    return '//src/core/styles:common_scss_lib';
                }
                else if (isInModule(core.join(entry.path, i), dir.path)) {
                    return `//${dir.path}:${core.basename(dir.path)}_scss_lib`;
                }
                else {
                    context.logger.warn(`${entry.path}: Could not resolve stylesheet import '${i}'`);
                    return '';
                }
            })
                .filter(d => !!d);
        }
        function isInModule(path, modulePath) {
            return !core.relative(modulePath, path).startsWith('..');
        }
        function moduleHasTests(dir) {
            let hasTests = false;
            dir.visit(path => {
                if (path.endsWith('.spec.ts')) {
                    hasTests = true;
                }
            });
            return hasTests;
        }
        function ngPackage(dir, ngModules) {
            const resolvePath = (m) => core.relative(dir.path, m.path);
            return schematics.mergeWith(schematics.apply(schematics.url('./files/ngPackage'), [
                schematics.template({
                    ...core.strings,
                    uc: (s) => s.toUpperCase(),
                    name: core.basename(dir.path),
                    entryPoints: ngModules.map(resolvePath),
                    hasReadme: dir.subfiles.includes(core.fragment('README.md')),
                    hasSchematics: dir.subdirs.includes(core.fragment('schematics')),
                    hasStyles: dir.subfiles.includes(core.fragment('_styles.scss')),
                    hasTypography: dir.subfiles.includes(core.fragment('typography.scss')),
                    markdownFiles: dir.subfiles.filter(f => f.endsWith('.md')),
                    markdownModules: ngModules.filter(m => moduleHasMarkdown(m)).map(resolvePath)
                }),
                schematics.move(dir.path),
                overwriteIfExists()
            ]));
        }
        function moduleHasMarkdown(dir) {
            return dir.subfiles.includes(core.fragment(`${core.basename(dir.path)}.md`));
        }
        function overwriteIfExists() {
            return schematics.forEach(fileEntry => {
                if (tree.exists(fileEntry.path)) {
                    tree.overwrite(fileEntry.path, fileEntry.content);
                    return null;
                }
                return fileEntry;
            });
        }
    };
}

exports.bazel = bazel;
