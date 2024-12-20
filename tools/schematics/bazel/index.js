var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// tools/schematics/bazel/index.ts
var index_exports = {};
__export(index_exports, {
  bazel: () => bazel
});
module.exports = __toCommonJS(index_exports);
var import_schematics4 = require("@angular-devkit/schematics");
var import_tasks = require("@angular-devkit/schematics/tasks");

// tools/schematics/bazel/bazel-genrule-resolver.ts
var import_core = require("@angular-devkit/core");
var BazelGenruleResolver = class {
  constructor() {
    this._buildFile = (0, import_core.fragment)("BUILD.bazel");
  }
  resolveGenrule(dir) {
    if (!dir.subfiles.includes(this._buildFile)) {
      return [];
    }
    return dir.file(this._buildFile).content.toString().match(/\ngenrule\([\w\W]+?\n\)/gm) || [];
  }
};

// tools/schematics/bazel/bazel-module-detector.ts
var import_core2 = require("@angular-devkit/core");
var BazelModuleDetectorBase = class {
  constructor(_tree) {
    this._tree = _tree;
  }
  findModuleBaseDirectory(dirOrFile) {
    let dir = !(typeof dirOrFile === "string") ? dirOrFile : this._tree.getDir((0, import_core2.dirname)(dirOrFile));
    while (!this.isModuleDirectory(dir)) {
      dir = dir.parent;
    }
    return dir;
  }
};
var LibraryBazelModuleDetector = class extends BazelModuleDetectorBase {
  isModuleDirectory(dir) {
    return dir.subfiles.includes((0, import_core2.fragment)("BUILD.bazel"));
  }
};
var AppBazelModuleDetector = class extends BazelModuleDetectorBase {
  isModuleDirectory(dir) {
    return dir.subfiles.some((f) => f.endsWith(".module.ts"));
  }
};

// tools/schematics/bazel/ng-package.ts
var import_core4 = require("@angular-devkit/core");

// tools/schematics/bazel/ng-module.ts
var import_core3 = require("@angular-devkit/core");
var import_schematics = require("@angular-devkit/schematics");

// tools/schematics/bazel/bazel-module-file-registry.ts
var BazelModuleFileRegistry = class {
  constructor() {
    this.markdownFiles = [];
    this.tsFiles = [];
    this.htmlFiles = [];
    this.specFiles = [];
    this.scssFiles = [];
    this.scssLibaryFiles = [];
    this.cssFiles = [];
  }
  add(file, dir) {
    if (file.endsWith(".spec.ts")) {
      this.specFiles.push(dir.file(file));
    } else if (file.endsWith(".ts")) {
      this.tsFiles.push(dir.file(file));
    } else if (file.endsWith(".md")) {
      this.markdownFiles.push(dir.file(file));
    } else if (file.endsWith(".html")) {
      this.htmlFiles.push(dir.file(file));
    } else if (file.endsWith(".scss") && file.startsWith("_")) {
      this.scssLibaryFiles.push(dir.file(file));
    } else if (file.endsWith(".scss")) {
      this.scssFiles.push(dir.file(file));
    } else if (file.endsWith(".css")) {
      this.cssFiles.push(dir.file(file));
    }
  }
};

// tools/schematics/bazel/format-bazel-file.ts
var import_child_process = require("child_process");
var import_crypto = require("crypto");
var import_fs = require("fs");
var import_os = require("os");
var import_path = require("path");
var { getNativeBinary } = require("@bazel/buildifier/buildifier");
function formatBazelFile(relativePath, content) {
  const tmpPath = (0, import_path.join)((0, import_os.tmpdir)(), `bazel_file_to_format_${(0, import_crypto.randomBytes)(32).toString("hex")}.bazel`);
  (0, import_fs.writeFileSync)(tmpPath, content, "utf8");
  const binary = getNativeBinary();
  (0, import_child_process.execSync)(`"${binary}" -path=${relativePath} "${tmpPath}"`);
  const result = (0, import_fs.readFileSync)(tmpPath, "utf8");
  (0, import_fs.unlinkSync)(tmpPath);
  return result;
}

// tools/schematics/bazel/ng-module.ts
var NgModule = class _NgModule {
  constructor(_dir, _tree, _context) {
    this._dir = _dir;
    this._tree = _tree;
    this._context = _context;
    this.customTsConfig = "";
    this._fileRegistry = new BazelModuleFileRegistry();
    this._templateUrl = "./files/ngModule";
    this._modules = [];
    this.path = this._dir.path;
    this._findFiles(this._dir);
    this.name = (0, import_core3.basename)(this.path);
    const moduleName = (0, import_core3.relative)(this._tree.getDir(this._context.srcRoot).path, this.path);
    this.moduleName = `${this._context.organization}/${moduleName}`;
    this.hasMarkdown = this._dir.subfiles.includes((0, import_core3.fragment)(`${(0, import_core3.basename)(this.path)}.md`));
    const tsDependencies = this._context.typeScriptDependencyResolver.resolveDependencies(
      this._fileRegistry.tsFiles
    );
    this.dependencies = tsDependencies.dependencies;
    this.genFiles = tsDependencies.files;
    this.genRules = this._context.bazelGenruleResolver.resolveGenrule(this._dir);
    this.hasTests = !!this._fileRegistry.specFiles.length;
    const testDependencies = this._context.typeScriptDependencyResolver.resolveDependencies(
      this._fileRegistry.specFiles,
      ["@npm//@angular/core"]
    );
    this.testDependencies = testDependencies.dependencies;
    this.hasSassLibrary = !!this._fileRegistry.scssLibaryFiles.length;
    this.sassBinaries = this._context.sassDependencyResolver.resolveDependencies(
      this._fileRegistry.scssFiles
    );
    this.stylesheets = this.sassBinaries.map((s) => s.path.replace(".scss", ".css"));
    this.hasHtml = !!this._fileRegistry.htmlFiles.length;
    this.hasCss = !!this._fileRegistry.cssFiles.length;
  }
  ngModules() {
    return this._modules.reduce((current, next) => current.concat(next.ngModules()), [
      this
    ]);
  }
  render() {
    return this._modules.reduce(
      (current, next) => current.concat(next.render()),
      [
        (0, import_schematics.mergeWith)(
          (0, import_schematics.apply)((0, import_schematics.url)(this._templateUrl), [
            (0, import_schematics.applyTemplates)(this._templateOptions()),
            (0, import_schematics.move)(this.path),
            (0, import_schematics.forEach)((fileEntry) => {
              const content = formatBazelFile(
                (0, import_core3.relative)(this._tree.root.path, fileEntry.path),
                fileEntry.content.toString()
              );
              fileEntry = {
                path: fileEntry.path,
                content: Buffer.from(content)
              };
              if (!this._tree.exists(fileEntry.path)) {
                return fileEntry;
              } else if (this._tree.read(fileEntry.path).toString() !== fileEntry.content.toString()) {
                this._tree.overwrite(fileEntry.path, fileEntry.content);
              }
              return null;
            })
          ])
        )
      ]
    );
  }
  _templateOptions() {
    return this;
  }
  _createSubModule(dir) {
    return new _NgModule(dir, this._tree, this._context);
  }
  _findFiles(dir, skipModuleCheck = true) {
    if (["schematics", "styles", "web-component"].some((d) => (0, import_core3.basename)(dir.path) === d)) {
      return;
    } else if (!skipModuleCheck && this._context.moduleDetector.isModuleDirectory(dir)) {
      this._modules.push(this._createSubModule(dir));
      return;
    }
    for (const file of dir.subfiles) {
      this._fileRegistry.add(file, dir);
    }
    dir.subdirs.forEach((d) => this._findFiles(dir.dir(d), false));
  }
};

// tools/schematics/bazel/ng-package.ts
var NgPackage = class extends NgModule {
  constructor(dir, tree, context) {
    super(dir, tree, context);
    this._templateUrl = "./files/ngPackage";
    this.shortName = this.name.replace("angular-", "");
    const ngModules = this.ngModules().slice(1);
    this.entryPoints = ngModules.map((m) => this._resolvePath(m));
    this.hasReadme = dir.subfiles.includes((0, import_core4.fragment)("README.md"));
    this.hasSchematics = dir.subdirs.includes((0, import_core4.fragment)("schematics"));
    this.hasSrcFiles = dir.subdirs.includes((0, import_core4.fragment)("src"));
    this.hasTypography = dir.subfiles.includes((0, import_core4.fragment)("typography.scss"));
    if (this.hasTypography) {
      this.sassBinaries = this.sassBinaries.filter((s) => !s.path.includes("typography.scss"));
      this.stylesheets = this.stylesheets.filter((s) => !s.includes("typography.css"));
    }
    this.hasFullFont = dir.subfiles.includes((0, import_core4.fragment)("fullfont.scss"));
    if (this.hasFullFont) {
      this.sassBinaries = this.sassBinaries.filter((s) => !s.path.includes("fullfont.scss"));
      this.stylesheets = this.stylesheets.filter((s) => !s.includes("fullfont.css"));
    }
    this.markdownModules = ngModules.filter((m) => m.hasMarkdown).map((m) => this._resolvePath(m));
    if (this.name === "journey-maps") {
      this.markdownModules.push("web-component");
    }
  }
  _resolvePath(m) {
    return (0, import_core4.relative)(this.path, m.path);
  }
  _templateOptions() {
    return {
      ...import_core4.strings,
      constant: (s) => s.replace(/-/g, "_").toUpperCase(),
      bazelName: (s) => s.replace(/-/g, "_"),
      ...this,
      dependencies: this.dependencies.filter((d) => !d.startsWith(`//src/${this.name}`))
    };
  }
};

// tools/schematics/bazel/ng-package-examples.ts
var NgPackageExamples = class extends NgPackage {
  constructor(dir, tree, context) {
    super(dir, tree, context);
    this._templateUrl = "./files/ngPackageExamples";
    this.shortName = this.name.replace("components-", "");
  }
  _templateOptions() {
    return {
      ...super._templateOptions(),
      exampleModules: this.ngModules().filter((ngModule) => ngModule !== this)
    };
  }
};

// tools/schematics/bazel/npm-dependency-resolver.ts
var import_schematics2 = require("@angular-devkit/schematics");
var NpmDependencyResolver = class {
  constructor(packageJson) {
    const pkg = JSON.parse(packageJson);
    const dependencies = "dependencies" in pkg ? Object.keys(pkg.dependencies) : [];
    const devDependencies = "devDependencies" in pkg ? Object.keys(pkg.devDependencies) : [];
    this._dependencies = dependencies.concat(devDependencies);
    this._typesDependencies = this._dependencies.filter((d) => d.startsWith("@types/")).reduce((map, dep) => map.set(this._typesToPackageName(dep), dep), /* @__PURE__ */ new Map());
  }
  resolvePackageNames(importPath) {
    const name = this._toPackageName(importPath);
    if (this._typesDependencies.has(name) && this._dependencies.includes(name)) {
      return [name, this._typesDependencies.get(name)];
    } else if (this._typesDependencies.has(name)) {
      return [this._typesDependencies.get(name)];
    } else if (this._dependencies.includes(name)) {
      return [name];
    } else {
      throw new import_schematics2.SchematicsException(`The dependency ${name} is not defined in the package.json`);
    }
  }
  toBazelNodeDependency(importPath) {
    return `@npm//${this._toPackageName(importPath)}`;
  }
  _typesToPackageName(name) {
    return name.replace(/^@types\//, "").replace(/^(.+)__(.+)$/, (_m, m1, m2) => `@${m1}/${m2}`);
  }
  _toPackageName(importPath) {
    const index = importPath.startsWith("@") ? 2 : 1;
    return importPath.split("/", index).join("/");
  }
};

// tools/schematics/bazel/sass-dependency-resolver.ts
var import_core5 = require("@angular-devkit/core");
var FlexibleSassDependencyResolver = class {
  constructor(_moduleDetector, _npmDependencyResolver, _logger, _dependencyByOccurence = /* @__PURE__ */ new Map()) {
    this._moduleDetector = _moduleDetector;
    this._npmDependencyResolver = _npmDependencyResolver;
    this._logger = _logger;
    this._dependencyByOccurence = _dependencyByOccurence;
  }
  resolveDependencies(files, dependencyBlocklist = []) {
    return files.map((file) => {
      const moduleBaseDir = this._moduleDetector.findModuleBaseDirectory(file.path);
      const stylesheetPath = (0, import_core5.relative)(moduleBaseDir.path, file.path);
      return {
        name: stylesheetPath.replace(/[^a-z0-9]/g, "_"),
        path: stylesheetPath,
        dependencies: this._findStylesheetDependencies(file, moduleBaseDir).filter((v, i, a) => a.indexOf(v) === i).filter((d) => !dependencyBlocklist.includes(d))
      };
    });
  }
  _findStylesheetDependencies(file, moduleDir) {
    const matches = file.content.toString().match(/(@import|@use) '([^']+)'[ \w]*;/g);
    if (!matches) {
      return [];
    }
    return matches.filter((s) => !s.match(/@use ['"]sass:/)).map(
      (s) => s.substring(s.trim().startsWith("@use") ? 6 : 9, s.length - 2).replace(/['"][ \w]*/, "")
    ).map((importPath) => {
      const occurence = Array.from(this._dependencyByOccurence.keys()).find(
        (o) => importPath.includes(o)
      );
      if (occurence) {
        return this._dependencyByOccurence.get(occurence);
      } else if (importPath.includes("/node_modules/")) {
        return this._npmDependencyResolver.toBazelNodeDependency(
          importPath.split("/node_modules/")[1]
        );
      } else if (importPath.includes("~")) {
        return this._npmDependencyResolver.toBazelNodeDependency(importPath.split("~")[1]);
      } else if (this._isInModule((0, import_core5.join)((0, import_core5.dirname)(file.path), importPath), moduleDir)) {
        return `:${(0, import_core5.basename)(moduleDir.path).replace(/-/g, "_")}_scss_lib`;
      } else {
        this._logger.warn(`${file.path}: Could not resolve stylesheet import '${importPath}'`);
        return "";
      }
    }).filter((d) => !!d).filter((v, i, a) => a.indexOf(v) === i);
  }
  _isInModule(file, moduleDir) {
    const fileModule = this._moduleDetector.findModuleBaseDirectory(file);
    return moduleDir.path === fileModule.path;
  }
};

// tools/schematics/bazel/showcase-package.ts
var import_core6 = require("@angular-devkit/core");

// tools/schematics/bazel/showcase-module.ts
var ShowcaseModule = class _ShowcaseModule extends NgModule {
  constructor() {
    super(...arguments);
    this._templateUrl = "./files/showcaseModule";
    this.customTsConfig = "//src/showcase:tsconfig.json";
  }
  _createSubModule(dir) {
    return new _ShowcaseModule(dir, this._tree, this._context);
  }
};

// tools/schematics/bazel/showcase-package.ts
var ShowcasePackage = class {
  constructor(_dir, _tree, context) {
    this._dir = _dir;
    this._tree = _tree;
    this._appDir = this._dir.dir((0, import_core6.fragment)("app"));
    this._appModule = new ShowcaseModule(this._appDir, this._tree, context);
  }
  render() {
    const exampleModules = this._appDir.subdirs.map((d) => {
      const dir = this._appDir.dir(d);
      const examplesDirName = (0, import_core6.fragment)(`${(0, import_core6.basename)(dir.path)}-examples`);
      if (!dir.subdirs.includes(examplesDirName)) {
        return [];
      }
      const examplesDir = dir.dir(examplesDirName);
      return examplesDir.subdirs.map((e) => `    "/${examplesDir.dir(e).path}",`);
    }).reduce((current, next) => current.concat(next), []).sort().join("\n");
    const buildFile = this._dir.file((0, import_core6.fragment)("BUILD.bazel"));
    this._tree.overwrite(
      buildFile.path,
      buildFile.content.toString().replace(/ALL_EXAMPLES = \[[^\]]+\]/m, `ALL_EXAMPLES = [
${exampleModules}
]`)
    );
    return this._appModule.render();
  }
};

// tools/schematics/bazel/typescript-dependency-resolver.ts
var import_core7 = require("@angular-devkit/core");
var import_schematics3 = require("@angular-devkit/schematics");
var schematicsTs = __toESM(require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript"));
var import_ast_utils = require("@schematics/angular/utility/ast-utils");
var TypeScriptDependencyResolverBase = class {
  constructor(_config) {
    this._config = _config;
  }
  resolveDependencies(files, dependencyBlocklist = []) {
    const result = { dependencies: [], files: [] };
    for (const file of files) {
      this._findFileDependencies({ file, files }).forEach((fileResult) => {
        result.dependencies.push(...fileResult.dependencies || []);
        result.files.push(...fileResult.files || []);
      });
    }
    result.dependencies = result.dependencies.filter((v, i, a) => a.indexOf(v) === i).filter((d) => !dependencyBlocklist.includes(d)).sort();
    result.files = result.files.filter((v, i, a) => a.indexOf(v) === i).sort();
    return result;
  }
  _findFileDependencies(details) {
    return this._findStaticDependencies(details).concat(
      this._findDependencyByOccurrence(details.file)
    );
  }
  _findStaticDependencies(details) {
    const sourceFile = schematicsTs.createSourceFile(
      (0, import_core7.basename)(details.file.path),
      details.file.content.toString(),
      schematicsTs.ScriptTarget.ESNext,
      true
    );
    return this._findImportsAndReexports(sourceFile).concat(this._findDynamicImports(sourceFile)).concat(this._findReferences(sourceFile)).filter((i) => !!i).map((importPath) => this._resolveTypeScriptImport({ importPath, ...details }));
  }
  _findImportsAndReexports(sourceFile) {
    return [
      ...(0, import_ast_utils.findNodes)(sourceFile, schematicsTs.SyntaxKind.ImportDeclaration, void 0, true),
      ...(0, import_ast_utils.findNodes)(sourceFile, schematicsTs.SyntaxKind.ExportDeclaration, void 0, true)
    ].map(
      (n) => {
        var _a;
        return ((_a = n.moduleSpecifier) == null ? void 0 : _a.getText().replace(/['"]/g, "")) ?? "";
      }
    );
  }
  _findDynamicImports(sourceFile) {
    return (0, import_ast_utils.findNodes)(sourceFile, schematicsTs.SyntaxKind.ImportKeyword, void 0, true).filter(
      (n) => n.getFullText().match(/ import/) && schematicsTs.isCallExpression(n.parent) && schematicsTs.isStringLiteral(n.parent.arguments[0])
    ).map(
      (n) => n.parent.arguments[0].getText().replace(/['"]/g, "")
    );
  }
  _findReferences(sourceFile) {
    return sourceFile.typeReferenceDirectives.map((d) => this._config.npmDependencyResolver.resolvePackageNames(d.fileName)).reduce((cur, next) => cur.concat(next), []);
  }
  _findDependencyByOccurrence(fileEntry) {
    if (!this._config.dependencyByOccurence) {
      return {};
    }
    const content = fileEntry.content.toString();
    return {
      dependencies: Array.from(this._config.dependencyByOccurence.keys()).filter((k) => content.includes(k)).map((k) => this._config.dependencyByOccurence.get(k))
    };
  }
  _resolveTypeScriptImport({
    importPath,
    file,
    files
  }) {
    if (importPath.startsWith(`${this._config.organization}/`)) {
      return {
        dependencies: [
          importPath.replace(`${this._config.organization}/`, `//${this._config.srcRoot}/`)
        ]
      };
    } else if (importPath.startsWith(".")) {
      const moduleBaseDir = this._config.moduleDetector.findModuleBaseDirectory(file.path);
      const importFilePath = (0, import_core7.join)((0, import_core7.dirname)(file.path), importPath.replace(/(\.ts)?$/, ".ts"));
      const importFileModuleBaseDir = this._config.moduleDetector.findModuleBaseDirectory(importFilePath);
      return this._resolveRelativeImport({
        file,
        files,
        importPath,
        importFilePath,
        moduleBaseDir,
        importFileModuleBaseDir
      });
    } else {
      return {
        dependencies: this._config.npmDependencyResolver.resolvePackageNames(importPath).map((d) => this._config.npmDependencyResolver.toBazelNodeDependency(d))
      };
    }
  }
};
var StrictModuleTypeScriptDependencyResolver = class extends TypeScriptDependencyResolverBase {
  _resolveRelativeImport({
    file,
    importFileModuleBaseDir,
    importFilePath,
    moduleBaseDir,
    importPath,
    files
  }) {
    if (importFileModuleBaseDir.path !== moduleBaseDir.path) {
      console.log(importFileModuleBaseDir.path);
      console.log(moduleBaseDir.path);
      throw new import_schematics3.SchematicsException(
        `Import ${importPath} in ${file.path} escapes Bazel module boundary!`
      );
    } else if (files.every((f) => f.path !== importFilePath)) {
      return { files: [(0, import_core7.relative)(moduleBaseDir.path, importFilePath)] };
    }
    return {};
  }
};
var RelativeModuleTypeScriptDependencyResolver = class extends TypeScriptDependencyResolverBase {
  _resolveRelativeImport({
    importFileModuleBaseDir,
    importFilePath,
    moduleBaseDir,
    files
  }) {
    if (importFileModuleBaseDir.path !== moduleBaseDir.path) {
      return { dependencies: [`/${importFileModuleBaseDir.path}`] };
    } else if (files.every((f) => f.path !== importFilePath)) {
      return { files: [(0, import_core7.relative)(moduleBaseDir.path, importFilePath)] };
    }
    return {};
  }
};

// tools/schematics/bazel/index.ts
function bazel(options) {
  return (tree, context) => {
    const srcDir = tree.getDir("src");
    if (!options.filter) {
      srcDir.subdirs.forEach((d) => context.addTask(new import_tasks.RunSchematicTask("bazel", { filter: d })));
    } else {
      return (0, import_schematics4.chain)(
        srcDir.subdirs.filter((d) => !options.filter || d === options.filter).map((d) => srcDir.dir(d)).map((packageDir) => {
          const isShowcase = packageDir.path.endsWith("showcase");
          const isComponentsExamples = packageDir.path.endsWith("components-examples");
          const organization = "@sbb-esta";
          const srcRoot = "src";
          const moduleDetector = isShowcase ? new AppBazelModuleDetector(tree) : new LibraryBazelModuleDetector(tree);
          const npmDependencyResolver = new NpmDependencyResolver(
            tree.read("package.json").toString()
          );
          const dependencyByOccurence = (/* @__PURE__ */ new Map()).set("ngDevMode", "//src:dev_mode_types").set("typeof global", "@npm//@types/node");
          const tsConfig = {
            organization,
            srcRoot,
            tree,
            moduleDetector,
            npmDependencyResolver,
            dependencyByOccurence
          };
          const typeScriptDependencyResolver = isShowcase ? new RelativeModuleTypeScriptDependencyResolver(tsConfig) : new StrictModuleTypeScriptDependencyResolver(tsConfig);
          const styleReplaceMap = (/* @__PURE__ */ new Map()).set("@sbb-esta/angular", "//src/angular:scss_lib").set("external/npm/node_modules/@angular/cdk", "//src/angular:scss_lib");
          const sassDependencyResolver = new FlexibleSassDependencyResolver(
            moduleDetector,
            npmDependencyResolver,
            context.logger,
            styleReplaceMap
          );
          const bazelGenruleResolver = new BazelGenruleResolver();
          if (isShowcase) {
            return new ShowcasePackage(packageDir, tree, {
              ...context,
              organization,
              srcRoot,
              moduleDetector,
              typeScriptDependencyResolver,
              sassDependencyResolver,
              bazelGenruleResolver
            });
          } else if (isComponentsExamples) {
            return new NgPackageExamples(packageDir, tree, {
              ...context,
              organization,
              srcRoot,
              moduleDetector,
              typeScriptDependencyResolver,
              sassDependencyResolver,
              bazelGenruleResolver
            });
          } else {
            return new NgPackage(packageDir, tree, {
              ...context,
              organization,
              srcRoot,
              moduleDetector,
              typeScriptDependencyResolver,
              sassDependencyResolver,
              bazelGenruleResolver
            });
          }
        }).reduce((current, next) => current.concat(next.render()), [])
      );
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bazel
});
