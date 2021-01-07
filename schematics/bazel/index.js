'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var schematics = require('@angular-devkit/schematics');
var tasks = require('@angular-devkit/schematics/tasks');
var core = require('@angular-devkit/core');
var child_process = require('child_process');
var crypto = require('crypto');
var fs = require('fs');
var os = require('os');
var path = require('path');
var schematicsTs = require('@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript');
var astUtils = require('@schematics/angular/utility/ast-utils');

class BazelGenruleResolver {
    constructor() {
        this._buildFile = core.fragment('BUILD.bazel');
    }
    resolveGenrule(dir) {
        if (!dir.subfiles.includes(this._buildFile)) {
            return [];
        }
        return (dir
            .file(this._buildFile)
            .content.toString()
            .match(/\ngenrule\([\w\W]+?\n\)/gm) || []);
    }
}

class BazelModuleDetectorBase {
    constructor(_tree) {
        this._tree = _tree;
    }
    findModuleBaseDirectory(dirOrFile) {
        let dir = !(typeof dirOrFile === 'string')
            ? dirOrFile
            : this._tree.getDir(core.dirname(dirOrFile));
        while (!this.isModuleDirectory(dir)) {
            dir = dir.parent;
        }
        return dir;
    }
}
class LibraryBazelModuleDetector extends BazelModuleDetectorBase {
    isModuleDirectory(dir) {
        return dir.subfiles.includes(core.fragment('public-api.ts'));
    }
}
class AppBazelModuleDetector extends BazelModuleDetectorBase {
    isModuleDirectory(dir) {
        return dir.subfiles.some((f) => f.endsWith('.module.ts'));
    }
}

class BazelModuleFileRegistry {
    constructor() {
        this.markdownFiles = [];
        this.tsFiles = [];
        this.htmlFiles = [];
        this.specFiles = [];
        this.scssFiles = [];
        this.scssLibaryFiles = [];
    }
    add(file, dir) {
        if (file.endsWith('.spec.ts')) {
            this.specFiles.push(dir.file(file));
        }
        else if (file.endsWith('.ts')) {
            this.tsFiles.push(dir.file(file));
        }
        else if (file.endsWith('.md')) {
            this.markdownFiles.push(dir.file(file));
        }
        else if (file.endsWith('.html')) {
            this.htmlFiles.push(dir.file(file));
        }
        else if (file.endsWith('.scss') && file.startsWith('_')) {
            this.scssLibaryFiles.push(dir.file(file));
        }
        else if (file.endsWith('.scss')) {
            this.scssFiles.push(dir.file(file));
        }
    }
}

const { getNativeBinary } = require('@bazel/buildifier/buildifier');
const buildifierArguments = parseBuildifierArguments();
function parseBuildifierArguments() {
    const pckg = require('../../package.json');
    const script = pckg.scripts['bazel:buildifier'];
    if (!script) {
        throw new schematics.SchematicsException('Could not find script bazel:buildifier in package.json');
    }
    const args = script.split('xargs buildifier -v')[1];
    if (!args) {
        throw new schematics.SchematicsException('Could not find `xargs buildifier -v` in bazel:buildifier in package.json');
    }
    return `${args} --lint=fix --mode=fix`;
}
function formatBazelFile(relativePath, content) {
    const tmpPath = path.join(os.tmpdir(), `bazel_file_to_format_${crypto.randomBytes(32).toString('hex')}.bazel`);
    fs.writeFileSync(tmpPath, content, 'utf8');
    const binary = getNativeBinary();
    child_process.execSync(`"${binary}" ${buildifierArguments} -path=${relativePath} "${tmpPath}"`);
    const result = fs.readFileSync(tmpPath, 'utf8');
    fs.unlinkSync(tmpPath);
    return result;
}

class NgModule {
    constructor(_dir, _tree, _context) {
        this._dir = _dir;
        this._tree = _tree;
        this._context = _context;
        this.customTsConfig = '';
        this._fileRegistry = new BazelModuleFileRegistry();
        this._templateUrl = './files/ngModule';
        this._modules = [];
        this.path = this._dir.path;
        this._findFiles(this._dir);
        this.name = core.basename(this.path);
        const moduleName = core.relative(this._tree.getDir(this._context.srcRoot).path, this.path);
        this.moduleName = `${this._context.organization}/${moduleName}`;
        this.hasMarkdown = this._dir.subfiles.includes(core.fragment(`${core.basename(this.path)}.md`));
        const tsDependencies = this._context.typeScriptDependencyResolver.resolveDependencies(this._fileRegistry.tsFiles);
        this.dependencies = tsDependencies.dependencies;
        this.genFiles = tsDependencies.files;
        this.genRules = this._context.bazelGenruleResolver.resolveGenrule(this._dir);
        this.hasTests = !!this._fileRegistry.specFiles.length;
        const testDependencies = this._context.typeScriptDependencyResolver.resolveDependencies(this._fileRegistry.specFiles, ['@npm//@angular/core']);
        this.testDependencies = testDependencies.dependencies;
        this.hasSassLibrary = !!this._fileRegistry.scssLibaryFiles.length;
        this.sassBinaries = this._context.sassDependencyResolver.resolveDependencies(this._fileRegistry.scssFiles);
        this.stylesheets = this.sassBinaries.map((s) => s.path.replace('.scss', '.css'));
        this.hasHtml = !!this._fileRegistry.htmlFiles.length;
    }
    ngModules() {
        return this._modules.reduce((current, next) => current.concat(next.ngModules()), [
            this,
        ]);
    }
    render() {
        return this._modules.reduce((current, next) => current.concat(next.render()), [
            schematics.mergeWith(schematics.apply(schematics.url(this._templateUrl), [
                schematics.template(this._templateOptions()),
                schematics.move(this.path),
                schematics.forEach((fileEntry) => {
                    const content = formatBazelFile(core.relative(this._tree.root.path, fileEntry.path), fileEntry.content.toString());
                    fileEntry = {
                        path: fileEntry.path,
                        content: Buffer.from(content),
                    };
                    if (!this._tree.exists(fileEntry.path)) {
                        return fileEntry;
                    }
                    else if (this._tree.read(fileEntry.path).toString() !== fileEntry.content.toString()) {
                        this._tree.overwrite(fileEntry.path, fileEntry.content);
                    }
                    return null;
                }),
            ])),
        ]);
    }
    _templateOptions() {
        return this;
    }
    _createSubModule(dir) {
        return new NgModule(dir, this._tree, this._context);
    }
    _findFiles(dir, skipModuleCheck = true) {
        if (['schematics', 'styles'].some((d) => core.basename(dir.path) === d)) {
            return;
        }
        else if (!skipModuleCheck && this._context.moduleDetector.isModuleDirectory(dir)) {
            this._modules.push(this._createSubModule(dir));
            return;
        }
        for (const file of dir.subfiles) {
            this._fileRegistry.add(file, dir);
        }
        dir.subdirs.forEach((d) => this._findFiles(dir.dir(d), false));
    }
}

class NgPackage extends NgModule {
    constructor(dir, tree, context) {
        super(dir, tree, context);
        this._templateUrl = './files/ngPackage';
        this.shortName = this.name.replace('angular-', '');
        const ngModules = this.ngModules().slice(1);
        this.entryPoints = ngModules.map((m) => this._resolvePath(m));
        this.hasReadme = dir.subfiles.includes(core.fragment('README.md'));
        this.hasSchematics = dir.subdirs.includes(core.fragment('schematics'));
        this.hasSrcFiles = dir.subdirs.includes(core.fragment('src'));
        this.hasStyleBundle = dir.subfiles.includes(core.fragment('_style_bundle.scss'));
        this.hasTypography = dir.subfiles.includes(core.fragment('typography.scss'));
        this.markdownModules = ngModules.filter((m) => m.hasMarkdown).map((m) => this._resolvePath(m));
    }
    _resolvePath(m) {
        return core.relative(this.path, m.path);
    }
    _templateOptions() {
        return {
            ...core.strings,
            uc: (s) => s.toUpperCase(),
            ...this,
            dependencies: this.dependencies.filter((d) => !d.startsWith(`//src/${this.name}`)),
        };
    }
}

class NpmDependencyResolver {
    constructor(packageJson) {
        const pkg = JSON.parse(packageJson);
        const dependencies = 'dependencies' in pkg ? Object.keys(pkg.dependencies) : [];
        const devDependencies = 'devDependencies' in pkg ? Object.keys(pkg.devDependencies) : [];
        this._dependencies = dependencies.concat(devDependencies);
        this._typesDependencies = this._dependencies
            .filter((d) => d.startsWith('@types/'))
            .reduce((map, dep) => map.set(this._typesToPackageName(dep), dep), new Map());
    }
    resolvePackageNames(importPath) {
        const name = this._toPackageName(importPath);
        if (this._typesDependencies.has(name) && this._dependencies.includes(name)) {
            return [name, this._typesDependencies.get(name)];
        }
        else if (this._typesDependencies.has(name)) {
            return [this._typesDependencies.get(name)];
        }
        else if (this._dependencies.includes(name)) {
            return [name];
        }
        else {
            throw new schematics.SchematicsException(`The dependency ${name} is not defined in the package.json`);
        }
    }
    toBazelNodeDependency(importPath) {
        return `@npm//${this._toPackageName(importPath)}`;
    }
    _typesToPackageName(name) {
        return name.replace(/^@types\//, '').replace(/^(.+)__(.+)$/, (_m, m1, m2) => `@${m1}/${m2}`);
    }
    _toPackageName(importPath) {
        const index = importPath.startsWith('@') ? 2 : 1;
        return importPath.split('/', index).join('/');
    }
}

class FlexibleSassDependencyResolver {
    constructor(_moduleDetector, _npmDependencyResolver, _logger, _dependencyByOccurence = new Map()) {
        this._moduleDetector = _moduleDetector;
        this._npmDependencyResolver = _npmDependencyResolver;
        this._logger = _logger;
        this._dependencyByOccurence = _dependencyByOccurence;
    }
    resolveDependencies(files, dependencyBlocklist = []) {
        return files.map((file) => {
            const moduleBaseDir = this._moduleDetector.findModuleBaseDirectory(file.path);
            const stylesheetPath = core.relative(moduleBaseDir.path, file.path);
            return {
                name: stylesheetPath.replace(/[^a-z0-9]/g, '_'),
                path: stylesheetPath,
                dependencies: this._findStylesheetDependencies(file, moduleBaseDir)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .filter((d) => !dependencyBlocklist.includes(d)),
            };
        });
    }
    _findStylesheetDependencies(file, moduleDir) {
        const matches = file.content.toString().match(/@import '([^']+)';/g);
        if (!matches) {
            return [];
        }
        return matches
            .map((s) => s.substring(9, s.length - 2))
            .map((importPath) => {
            const occurence = Array.from(this._dependencyByOccurence.keys()).find((o) => importPath.includes(o));
            if (occurence) {
                return this._dependencyByOccurence.get(occurence);
            }
            else if (this._isInModule(core.join(core.dirname(file.path), importPath), moduleDir)) {
                return `:${core.basename(moduleDir.path)}_scss_lib`;
            }
            else if (importPath.includes('/node_modules/')) {
                return this._npmDependencyResolver.toBazelNodeDependency(importPath.split('/node_modules/')[1]);
            }
            else if (importPath.includes('~')) {
                return this._npmDependencyResolver.toBazelNodeDependency(importPath.split('~')[1]);
            }
            else {
                this._logger.warn(`${file.path}: Could not resolve stylesheet import '${importPath}'`);
                return '';
            }
        })
            .filter((d) => !!d)
            .filter((v, i, a) => a.indexOf(v) === i);
    }
    _isInModule(file, moduleDir) {
        const fileModule = this._moduleDetector.findModuleBaseDirectory(file);
        return moduleDir.path === fileModule.path;
    }
}

class ShowcaseModule extends NgModule {
    constructor() {
        super(...arguments);
        this._templateUrl = './files/showcaseModule';
        this.customTsConfig = '//src/showcase:tsconfig.json';
    }
    _createSubModule(dir) {
        return new ShowcaseModule(dir, this._tree, this._context);
    }
}

class ShowcasePackage {
    constructor(_dir, _tree, context) {
        this._dir = _dir;
        this._tree = _tree;
        this._appDir = this._dir.dir(core.fragment('app'));
        this._appModule = new ShowcaseModule(this._appDir, this._tree, context);
    }
    render() {
        const exampleModules = this._appDir.subdirs
            .map((d) => {
            const dir = this._appDir.dir(d);
            const examplesDirName = core.fragment(`${core.basename(dir.path)}-examples`);
            if (!dir.subdirs.includes(examplesDirName)) {
                return [];
            }
            const examplesDir = dir.dir(examplesDirName);
            return examplesDir.subdirs.map((e) => `    "/${examplesDir.dir(e).path}",`);
        })
            .reduce((current, next) => current.concat(next), [])
            .sort()
            .join('\n');
        const buildFile = this._dir.file(core.fragment('BUILD.bazel'));
        this._tree.overwrite(buildFile.path, buildFile.content
            .toString()
            .replace(/ALL_EXAMPLES = \[[^\]]+\]/m, `ALL_EXAMPLES = [\n${exampleModules}\n]`));
        return this._appModule.render();
    }
}

class TypeScriptDependencyResolverBase {
    constructor(_config) {
        this._config = _config;
    }
    resolveDependencies(files, dependencyBlocklist = []) {
        const result = { dependencies: [], files: [] };
        for (const file of files) {
            this._findFileDependencies({ file, files }).forEach((fileResult) => {
                result.dependencies.push(...(fileResult.dependencies || []));
                result.files.push(...(fileResult.files || []));
            });
        }
        result.dependencies = result.dependencies
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter((d) => !dependencyBlocklist.includes(d))
            .sort();
        result.files = result.files.filter((v, i, a) => a.indexOf(v) === i).sort();
        return result;
    }
    _findFileDependencies(details) {
        return this._findStaticDependencies(details).concat(this._findDependencyByOccurrence(details.file));
    }
    _findStaticDependencies(details) {
        const sourceFile = schematicsTs.createSourceFile(core.basename(details.file.path), details.file.content.toString(), schematicsTs.ScriptTarget.ESNext, true);
        return this._findImportsAndReexports(sourceFile)
            .concat(this._findDynamicImports(sourceFile))
            .concat(this._findReferences(sourceFile))
            .filter((i) => !!i)
            .map((importPath) => this._resolveTypeScriptImport({ importPath, ...details }));
    }
    _findImportsAndReexports(sourceFile) {
        return [
            ...astUtils.findNodes(sourceFile, schematicsTs.SyntaxKind.ImportDeclaration, undefined, true),
            ...astUtils.findNodes(sourceFile, schematicsTs.SyntaxKind.ExportDeclaration, undefined, true),
        ].map((n) => { var _a, _b; return (_b = (_a = n.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.getText().replace(/['"]/g, '')) !== null && _b !== void 0 ? _b : ''; });
    }
    _findDynamicImports(sourceFile) {
        return astUtils.findNodes(sourceFile, schematicsTs.SyntaxKind.ImportKeyword, undefined, true)
            .filter((n) => n.getFullText().match(/ import/))
            .map((n) => n.parent.arguments[0].getText().replace(/['"]/g, ''));
    }
    _findReferences(sourceFile) {
        return sourceFile.typeReferenceDirectives
            .map((d) => this._config.npmDependencyResolver.resolvePackageNames(d.fileName))
            .reduce((cur, next) => cur.concat(next), []);
    }
    _findDependencyByOccurrence(fileEntry) {
        if (!this._config.dependencyByOccurence) {
            return {};
        }
        const content = fileEntry.content.toString();
        return {
            dependencies: Array.from(this._config.dependencyByOccurence.keys())
                .filter((k) => content.includes(k))
                .map((k) => this._config.dependencyByOccurence.get(k)),
        };
    }
    _resolveTypeScriptImport({ importPath, file, files, }) {
        if (importPath.startsWith(`${this._config.organization}/`)) {
            return {
                dependencies: [
                    importPath.replace(`${this._config.organization}/`, `//${this._config.srcRoot}/`),
                ],
            };
        }
        else if (importPath.startsWith('.')) {
            const moduleBaseDir = this._config.moduleDetector.findModuleBaseDirectory(file.path);
            const importFilePath = core.join(core.dirname(file.path), importPath.replace(/(\.ts)?$/, '.ts'));
            const importFileModuleBaseDir = this._config.moduleDetector.findModuleBaseDirectory(importFilePath);
            return this._resolveRelativeImport({
                file,
                files,
                importPath,
                importFilePath,
                moduleBaseDir,
                importFileModuleBaseDir,
            });
        }
        else {
            return {
                dependencies: this._config.npmDependencyResolver
                    .resolvePackageNames(importPath)
                    .map((d) => this._config.npmDependencyResolver.toBazelNodeDependency(d)),
            };
        }
    }
}
class StrictModuleTypeScriptDependencyResolver extends TypeScriptDependencyResolverBase {
    _resolveRelativeImport({ file, importFileModuleBaseDir, importFilePath, moduleBaseDir, importPath, files, }) {
        if (importFileModuleBaseDir.path !== moduleBaseDir.path) {
            console.log(importFileModuleBaseDir.path);
            console.log(moduleBaseDir.path);
            throw new schematics.SchematicsException(`Import ${importPath} in ${file.path} escapes Bazel module boundary!`);
        }
        else if (files.every((f) => f.path !== importFilePath)) {
            return { files: [core.relative(moduleBaseDir.path, importFilePath)] };
        }
        return {};
    }
}
class RelativeModuleTypeScriptDependencyResolver extends TypeScriptDependencyResolverBase {
    _resolveRelativeImport({ importFileModuleBaseDir, importFilePath, moduleBaseDir, files, }) {
        if (importFileModuleBaseDir.path !== moduleBaseDir.path) {
            return { dependencies: [`/${importFileModuleBaseDir.path}`] };
        }
        else if (files.every((f) => f.path !== importFilePath)) {
            return { files: [core.relative(moduleBaseDir.path, importFilePath)] };
        }
        return {};
    }
}

function bazel(options) {
    return (tree, context) => {
        if (!isRunViaBuildBazelYarnCommand()) {
            throw new schematics.SchematicsException(`Please run this schematic via 'yarn generate:bazel'`);
        }
        const srcDir = tree.getDir('src');
        if (!options.filter) {
            srcDir.subdirs.forEach((d) => context.addTask(new tasks.RunSchematicTask('bazel', { filter: d })));
        }
        else {
            return schematics.chain(srcDir.subdirs
                .filter((d) => !options.filter || d === options.filter)
                .map((d) => srcDir.dir(d))
                .map((packageDir) => {
                const isShowcase = packageDir.path.includes('showcase');
                const isAngular = packageDir.path.endsWith('angular');
                const organization = '@sbb-esta';
                const srcRoot = 'src';
                const moduleDetector = isShowcase
                    ? new AppBazelModuleDetector(tree)
                    : new LibraryBazelModuleDetector(tree);
                const npmDependencyResolver = new NpmDependencyResolver(tree.read('package.json').toString());
                const dependencyByOccurence = new Map().set('ngDevMode', '//src:dev_mode_types');
                const tsConfig = {
                    organization,
                    srcRoot,
                    tree,
                    moduleDetector,
                    npmDependencyResolver,
                    dependencyByOccurence,
                };
                const typeScriptDependencyResolver = isShowcase
                    ? new RelativeModuleTypeScriptDependencyResolver(tsConfig)
                    : new StrictModuleTypeScriptDependencyResolver(tsConfig);
                const sassDependencyResolver = new FlexibleSassDependencyResolver(moduleDetector, npmDependencyResolver, context.logger, new Map()
                    .set('/angular-core/styles/common', '//src/angular-core/styles:common_scss_lib')
                    .set('external/npm/node_modules/@angular/cdk/a11y', '//src/angular-core/styles:common_scss_lib'));
                const bazelGenruleResolver = new BazelGenruleResolver();
                if (isShowcase) {
                    return new ShowcasePackage(packageDir, tree, {
                        ...context,
                        organization,
                        srcRoot,
                        moduleDetector,
                        typeScriptDependencyResolver,
                        sassDependencyResolver,
                        bazelGenruleResolver,
                    });
                }
                else if (isAngular) {
                    return new NgPackage(packageDir, tree, {
                        ...context,
                        organization,
                        srcRoot,
                        moduleDetector,
                        typeScriptDependencyResolver,
                        sassDependencyResolver: new FlexibleSassDependencyResolver(moduleDetector, npmDependencyResolver, context.logger, new Map()
                            .set('/angular/styles/common', '//src/angular/styles:common_scss_lib')
                            .set('external/npm/node_modules/@angular/cdk/a11y', '//src/angular/styles:common_scss_lib')),
                        bazelGenruleResolver,
                    });
                }
                else {
                    return new NgPackage(packageDir, tree, {
                        ...context,
                        organization,
                        srcRoot,
                        moduleDetector,
                        typeScriptDependencyResolver,
                        sassDependencyResolver,
                        bazelGenruleResolver,
                    });
                }
            })
                .reduce((current, next) => current.concat(next.render()), []));
        }
        function isRunViaBuildBazelYarnCommand() {
            return (process.env.npm_config_user_agent &&
                process.env.npm_config_user_agent.startsWith('yarn') &&
                process.env.npm_lifecycle_event &&
                process.env.npm_lifecycle_event === 'generate:bazel');
        }
    };
}

exports.bazel = bazel;
