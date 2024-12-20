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

// tools/schematics/extract-symbols/index.ts
var index_exports = {};
__export(index_exports, {
  extractSymbols: () => extractSymbols
});
module.exports = __toCommonJS(index_exports);
var import_core = require("@angular-devkit/core");
var import_typescript = __toESM(require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript"));
var IGNORED_FOLDERS = ["/src/angular/schematics/ng-update/test-cases/"];
function extractSymbols() {
  return (tree) => {
    let symbols = {};
    extractExportsForModule("src/angular/");
    sortSymbols();
    tree.overwrite(
      "/src/angular/schematics/ng-update/migrations/sbb-angular-symbols.json",
      JSON.stringify(symbols, null, 2)
    );
    function extractExportsForModule(rootPath) {
      tree.getDir(rootPath).visit((filePath, moduleDirEntry) => {
        if (!(moduleDirEntry && filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts")) || isInIgnoredFolders(filePath)) {
          return;
        }
        const tsFile = import_typescript.default.createSourceFile(
          filePath,
          moduleDirEntry.content.toString(),
          import_typescript.default.ScriptTarget.Latest
        );
        tsFile.statements.filter(hasExportModifier).forEach((statement) => {
          extractSymbolOfStatement(filePath, rootPath, statement);
        });
      });
    }
    function isInIgnoredFolders(filePath) {
      return IGNORED_FOLDERS.some((folder) => filePath.startsWith(folder));
    }
    function hasExportModifier(statement) {
      return statement.modifiers && statement.modifiers.some((modifier) => modifier.kind === import_typescript.default.SyntaxKind.ExportKeyword);
    }
    function extractSymbolOfStatement(filePath, rootPath, statement) {
      const modulePath = resolvePackageModule(filePath).replace("/" + rootPath, "");
      if (import_typescript.default.isVariableStatement(statement)) {
        statement.declarationList.declarations.map((declaration) => declaration.name).filter(import_typescript.default.isIdentifier).map((identifier) => identifier.escapedText).forEach((name) => addToSymbols(name, modulePath));
      } else if (statement.name && statement.name.kind === import_typescript.default.SyntaxKind.Identifier) {
        const typedName = statement.name;
        addToSymbols(typedName.escapedText, modulePath);
      }
    }
    function resolvePackageModule(path) {
      let dir;
      if (!isDir(path)) {
        dir = parentDir(path);
      } else {
        dir = path;
      }
      const bazelFile = tree.getDir(dir).file("BUILD.bazel");
      if (bazelFile == null) {
        return resolvePackageModule(parentDir(dir));
      }
      return dir;
    }
    function isDir(path) {
      try {
        tree.getDir(path);
      } catch (e) {
        if (e instanceof import_core.PathIsFileException) {
          return false;
        } else {
          throw Error;
        }
      }
      return true;
    }
    function parentDir(path) {
      return path.split("/").slice(0, -1).join("/");
    }
    function addToSymbols(name, modulePath) {
      if (symbols[name] && symbols[name] !== modulePath) {
        console.warn(
          `symbol ${name} is already in list with value ${symbols[name]}. Tried to add ${modulePath}.`
        );
      }
      symbols[name] = modulePath;
    }
    function sortSymbols() {
      symbols = Object.entries(symbols).sort(([a], [b]) => a.localeCompare(b)).sort(([, a], [, b]) => a.localeCompare(b)).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractSymbols
});
