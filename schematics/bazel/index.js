'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var schematics = require('@angular-devkit/schematics');
var core = require('@angular-devkit/core');
var astUtils = require('@schematics/angular/utility/ast-utils');
var typescript = require('typescript');

class NgModule {
    constructor(_dir, _tree, _context) {
        this._dir = _dir;
        this._tree = _tree;
        this._context = _context;
        this.customTsConfig = '';
        this._templateUrl = './files/ngModule';
        this._markdownFiles = [];
        this._tsFiles = [];
        this._htmlFiles = [];
        this._specFiles = [];
        this._scssFiles = [];
        this._scssLibaryFiles = [];
        this._modules = [];
        this.path = this._dir.path;
        this._findFiles(this._dir);
        this.name = core.basename(this.path);
        const packageName = core.split(this.path)[2];
        const moduleName = core.relative(this._tree.getDir('src').dir(packageName).path, this.path);
        this.moduleName = `@sbb-esta/angular-${packageName}/${moduleName}`;
        this.hasMarkdown = this._dir.subfiles.includes(core.fragment(`${core.basename(this.path)}.md`));
        this.dependencies = this._findDependencies();
        this.hasTests = !!this._specFiles.length;
        this.testDependencies = this.hasTests ? this._findTestDependencies() : [];
        this.hasSassLibrary = !!this._scssLibaryFiles.length;
        this.sassBinaries = this._findSassBinaries();
        this.stylesheets = this.sassBinaries.map(s => s.path.replace('.scss', '.css'));
    }
    ngModules() {
        return this._modules.reduce((current, next) => current.concat(next.ngModules()), [
            this
        ]);
    }
    render() {
        return this._modules.reduce((current, next) => current.concat(next.render()), [
            schematics.mergeWith(schematics.apply(schematics.url(this._templateUrl), [
                schematics.template(this._templateOptions()),
                schematics.move(this.path),
                schematics.forEach(fileEntry => {
                    if (this._tree.exists(fileEntry.path)) {
                        this._tree.overwrite(fileEntry.path, fileEntry.content);
                        return null;
                    }
                    return fileEntry;
                })
            ]))
        ]);
    }
    _templateOptions() {
        return this;
    }
    _isModuleDir(dir) {
        return dir.subfiles.includes(core.fragment('public-api.ts'));
    }
    _createSubModule(dir) {
        return new NgModule(dir, this._tree, this._context);
    }
    _resolveTsImport(importPath, _fileEntry) {
        if (importPath.startsWith('@sbb-esta/')) {
            return importPath.replace('@sbb-esta/angular-', '//src/');
        }
        else if (importPath.startsWith('.')) {
            return '';
        }
        else {
            return this._toNodeDependency(importPath);
        }
    }
    _findFiles(dir, skipModuleCheck = true) {
        if (['schematics', 'styles'].some(d => core.basename(dir.path) === d)) {
            return;
        }
        else if (!skipModuleCheck && this._isModuleDir(dir)) {
            this._modules.push(this._createSubModule(dir));
            return;
        }
        for (const file of dir.subfiles) {
            if (file.endsWith('.spec.ts')) {
                this._specFiles.push(dir.file(file));
            }
            else if (file.endsWith('.ts')) {
                this._tsFiles.push(dir.file(file));
            }
            else if (file.endsWith('.md')) {
                this._markdownFiles.push(dir.file(file));
            }
            else if (file.endsWith('.html')) {
                this._htmlFiles.push(dir.file(file));
            }
            else if (file.endsWith('.scss') && file.startsWith('_')) {
                this._scssLibaryFiles.push(dir.file(file));
            }
            else if (file.endsWith('.scss')) {
                this._scssFiles.push(dir.file(file));
            }
        }
        dir.subdirs.forEach(d => this._findFiles(dir.dir(d), false));
    }
    _findDependencies() {
        const dependencies = this._tsFiles
            .reduce((current, f) => current.concat(this._findImportsAndReexports(f)), [])
            .filter((v, i, a) => a.indexOf(v) === i);
        if (this.path.includes('src/maps/')) {
            dependencies.push('@npm//@types/arcgis-js-api');
        }
        else if (this.path.includes('captcha')) {
            dependencies.push('@npm//@types/grecaptcha');
        }
        return dependencies.sort();
    }
    _findTestDependencies() {
        return this._specFiles
            .reduce((current, f) => current.concat(this._findImportsAndReexports(f)), [])
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter(i => !this.dependencies.includes(i))
            .sort();
    }
    _findImportsAndReexports(fileEntry) {
        const file = typescript.createSourceFile(core.basename(fileEntry.path), fileEntry.content.toString(), typescript.ScriptTarget.ESNext, true);
        return astUtils.findNodes(file, typescript.SyntaxKind.ImportDeclaration, undefined, true)
            .concat(astUtils.findNodes(file, typescript.SyntaxKind.ExportDeclaration, undefined, true))
            .map((n) => { var _a, _b; return (_b = (_a = n.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.getText().replace(/['"]/g, '')) !== null && _b !== void 0 ? _b : ''; })
            .map(i => this._resolveTsImport(i, fileEntry))
            .filter(i => !!i);
    }
    _findSassBinaries() {
        return this._scssFiles
            .filter(f => f.path.endsWith('.scss') && !core.basename(f.path).startsWith('_'))
            .map(file => {
            const stylesheetPath = core.relative(this.path, file.path);
            return {
                name: stylesheetPath.replace(/[^a-z0-9]/g, '_'),
                path: stylesheetPath,
                dependencies: this._findStylesheetDependencies(file)
            };
        });
    }
    _findStylesheetDependencies(entry) {
        const matches = entry.content.toString().match(/@import '([^']+)';/g);
        if (!matches) {
            return [];
        }
        return matches
            .map(s => s.substring(9, s.length - 2))
            .map(importPath => {
            if (importPath.includes('/core/styles/common')) {
                return '//src/core/styles:common_scss_lib';
            }
            else if (this._isInModule(core.join(entry.path, importPath))) {
                return `:${core.basename(this.path)}_scss_lib`;
            }
            else if (importPath.includes('/node_modules/')) {
                return this._toNodeDependency(importPath.split('/node_modules/')[1]);
            }
            else if (importPath.includes('~')) {
                return this._toNodeDependency(importPath.split('~')[1]);
            }
            else {
                this._context.logger.warn(`${entry.path}: Could not resolve stylesheet import '${importPath}'`);
                return '';
            }
        })
            .filter(d => !!d)
            .filter((v, i, a) => a.indexOf(v) === i);
    }
    _isInModule(path) {
        return !core.relative(this.path, path).startsWith('..');
    }
    _toNodeDependency(importPath) {
        const index = importPath.startsWith('@') ? 2 : 1;
        return `@npm//${importPath.split('/', index).join('/')}`;
    }
}

class NgPackage extends NgModule {
    constructor(dir, tree, context) {
        super(dir, tree, context);
        this._templateUrl = './files/ngPackage';
        const ngModules = this.ngModules().slice(1);
        this.entryPoints = ngModules.map(m => this._resolvePath(m));
        this.hasReadme = dir.subfiles.includes(core.fragment('README.md'));
        this.hasSchematics = dir.subdirs.includes(core.fragment('schematics'));
        this.hasSrcFiles = dir.subdirs.includes(core.fragment('src'));
        this.hasStyles = dir.subfiles.includes(core.fragment('_styles.scss'));
        this.hasTypography = dir.subfiles.includes(core.fragment('typography.scss'));
        this.markdownFiles = this._markdownFiles.map(f => core.basename(f.path));
        this.markdownModules = ngModules.filter(m => m.hasMarkdown).map(m => this._resolvePath(m));
    }
    _resolvePath(m) {
        return core.relative(this.path, m.path);
    }
    _templateOptions() {
        return {
            ...core.strings,
            uc: (s) => s.toUpperCase(),
            ...this,
            dependencies: this.dependencies.filter(d => !d.startsWith(`//src/${this.name}`))
        };
    }
}

class ShowcaseModule extends NgModule {
    constructor() {
        super(...arguments);
        this._templateUrl = './files/showcaseModule';
        this.customTsConfig = '//src/showcase:tsconfig.json';
    }
    _isModuleDir(dir) {
        return dir.subfiles.some(f => f.endsWith('.module.ts'));
    }
    _createSubModule(dir) {
        return new ShowcaseModule(dir, this._tree, this._context);
    }
    _resolveTsImport(importPath, fileEntry) {
        const path = super._resolveTsImport(importPath, fileEntry);
        if (path !== '') {
            return path;
        }
        else if (importPath.endsWith('/package.json')) {
            return '//:package.json';
        }
        const joinedPath = core.dirname(core.join(core.dirname(fileEntry.path), importPath));
        const importDir = this._tree.getDir(joinedPath);
        if (!importPath) {
            throw new schematics.SchematicsException(`Can't find '${importPath}' from '${fileEntry.path}'`);
        }
        let moduleDir = importDir;
        while (!this._isModuleDir(moduleDir)) {
            moduleDir = moduleDir.parent;
        }
        if (moduleDir.path !== this.path) {
            return `/${moduleDir.path}`;
        }
        return '';
    }
    _templateOptions() {
        return {
            ...this,
            tsFiles: this._tsFiles.map(f => core.relative(this.path, f.path)),
            htmlFiles: this._htmlFiles.map(f => core.relative(this.path, f.path))
        };
    }
}

class ShowcasePackage {
    constructor(_dir, _tree, context) {
        this._dir = _dir;
        this._tree = _tree;
        this._appModule = new ShowcaseModule(this._dir.dir(core.fragment('app')), this._tree, context);
        this._appModule.dependencies.push(...this._appModule.ngModules().map(m => `/${m.path}`));
        this._appModule.dependencies.sort();
    }
    render() {
        return this._appModule.render();
    }
}

function bazel() {
    return (tree, context) => {
        const srcDir = tree.getDir('src');
        return schematics.chain(srcDir.subdirs
            .map(d => srcDir.dir(d))
            .map(packageDir => packageDir.path.endsWith('showcase')
            ? new ShowcasePackage(packageDir, tree, context)
            : new NgPackage(packageDir, tree, context))
            .reduce((current, next) => current.concat(next.render()), []));
    };
}

exports.bazel = bazel;
