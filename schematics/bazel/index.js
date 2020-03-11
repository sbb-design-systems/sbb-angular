'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');
var astUtils = require('@schematics/angular/utility/ast-utils');
var typescript = require('typescript');

function bazel() {
    return async (tree, context) => {
        context.logger.info('Start');
        const srcDir = tree.getDir('src');
        for (const projectDir of srcDir.subdirs
            .filter(d => !d.startsWith('showcase'))
            .map(d => srcDir.dir(d))) {
            for (const moduleDir of findNonFlatModules(projectDir)) {
                context.logger.info(moduleDir.path);
                await ngModule(moduleDir, context);
            }
            await ngPackage(projectDir, context);
        }
    };
}
function findNonFlatModules(dir) {
    const directories = dir.subdirs.map(d => dir.dir(d));
    const modules = directories.filter(d => d.subfiles.includes(core.fragment('public-api.ts')));
    return directories
        .map(d => findNonFlatModules(d))
        .reduce((current, next) => current.concat(next), modules);
}
async function ngModule(dir, context) {
    // tslint:disable-next-line: no-non-null-assertion
    context.logger.info(`ng Module ${dir.path}`);
    const imports = aggregateModuleImports(dir, p => p.endsWith('.ts') && !p.endsWith('.spec.ts'));
    context.logger.info(imports.join(','));
}
function aggregateModuleImports(dir, predicate) {
    const imports = [];
    dir.visit((path, entry) => {
        if (predicate(path) && entry) {
            imports.push(...findImports(path, entry).filter(i => !i.startsWith('.') && !imports.includes(i)));
        }
    });
    return imports.sort();
}
function findImports(path, entry) {
    const file = typescript.createSourceFile(core.basename(path), entry.content.toString(), typescript.ScriptTarget.ESNext, true);
    return astUtils.findNodes(file, typescript.SyntaxKind.ImportDeclaration, undefined, true).map((n) => n.moduleSpecifier.getText().replace(/['"]/g, ''));
}
async function ngPackage(dir, context) {
    context.logger.info(`ng Package ${dir.path}`);
}

exports.bazel = bazel;
