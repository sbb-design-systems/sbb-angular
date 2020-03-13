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
                    hasMarkdown: dir.subfiles.includes(core.fragment(`${core.basename(dir.path)}.md`)),
                    dependencies,
                    testDependencies,
                    ...findStylesheets(dir)
                }),
                schematics.move(dir.path),
                overwriteIfExists()
            ]));
        }
        function aggregateModuleImports(dir, excludeTests = true) {
            const imports = [];
            dir.visit((path, entry) => {
                if (path.endsWith('.ts') && (!excludeTests || !path.endsWith('.spec.ts')) && entry) {
                    for (const importPath of findImports(path, entry).map(convertToDependency)) {
                        if (importPath && !imports.includes(importPath)) {
                            imports.push(importPath);
                        }
                    }
                }
            });
            return imports;
        }
        function findImports(path, entry) {
            const file = typescript.createSourceFile(core.basename(path), entry.content.toString(), typescript.ScriptTarget.ESNext, true);
            return astUtils.findNodes(file, typescript.SyntaxKind.ImportDeclaration, undefined, true).map((n) => n.moduleSpecifier.getText().replace(/['"]/g, ''));
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
        function ngPackage(dir, ngModules) {
            return schematics.mergeWith(schematics.apply(schematics.url('./files/ngPackage'), [
                schematics.template({
                    ...core.strings,
                    uc: (s) => s.toUpperCase(),
                    name: core.basename(dir.path),
                    entryPoints: ngModules.map(m => core.relative(dir.path, m.path)),
                    hasTypography: dir.subfiles.includes(core.fragment('typography.scss')),
                    hasStyles: dir.subfiles.includes(core.fragment('_styles.scss')),
                    hasSchematics: dir.subdirs.includes(core.fragment('schematics')),
                    markdownFiles: dir.subfiles.filter(f => f.endsWith('.md'))
                }),
                schematics.move(dir.path),
                overwriteIfExists()
            ]));
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
