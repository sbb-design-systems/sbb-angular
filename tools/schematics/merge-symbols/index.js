var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// tools/schematics/merge-symbols/index.ts
__export(exports, {
  mergeSymbols: () => mergeSymbols
});
var import_core = __toModule(require("@angular-devkit/core"));
var import_typescript = __toModule(require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript"));
var IGNORED_FOLDERS = ["/src/angular/schematics/ng-add/test-cases/"];
function mergeSymbols() {
  return (tree) => {
    let symbols = {
      SbbOptionGroup: "core",
      SbbLinksModule: "button",
      SbbLink: "button",
      SbbContextmenuModule: "menu",
      SbbDropdown: "menu",
      SbbDropdownSelectedEvent: "menu",
      getSbbDropdownMissingPanelError: "menu",
      SBB_DROPDOWN_SCROLL_STRATEGY: "menu",
      SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY: "menu",
      SBB_DROPDOWN_OPTION_HEIGHT: "menu",
      SBB_DROPDOWN_PANEL_HEIGHT: "menu",
      SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER: "menu",
      SbbDropdownTrigger: "menu",
      SbbDropdownOrigin: "menu",
      SbbDropdownSelectionChange: "menu",
      SbbDropdownParent: "menu",
      SBB_DROPDOWN_ITEM_PARENT_COMPONENT: "menu",
      getDropdownItemScrollPosition: "menu",
      SbbDropdownItem: "menu",
      SbbDropdownModule: "menu",
      SbbDropdownDefaultOptions: "menu",
      SbbBusinessDateAdapter: "core",
      SBB_BUSINESS_DATE_ADAPTER: "core",
      SbbChipInputChange: "chips",
      SbbChipModule: "chips",
      SbbPaginatorComponent: "pagination",
      SbbPageChangeEvent: "pagination",
      SbbPagination: "pagination",
      SbbTabs: "tabs",
      SbbDialogHeader: "dialog",
      SbbDialogFooter: "dialog",
      SbbProcessflowStep: "processflow",
      SbbTagChange: "tag"
    };
    extractExportsForModule("src/angular/");
    extractExportsForModule("src/angular-maps/");
    sortSymbols();
    tree.overwrite("/src/angular/schematics/ng-add/migrations/sbb-angular-symbols.json", JSON.stringify(symbols, null, 2));
    function extractExportsForModule(rootPath) {
      tree.getDir(rootPath).visit((filePath, moduleDirEntry) => {
        if (!(moduleDirEntry && filePath.endsWith(".ts") && !filePath.endsWith(".spec.ts")) || isInIgnoredFolders(filePath)) {
          return;
        }
        const tsFile = import_typescript.default.createSourceFile(filePath, moduleDirEntry.content.toString(), import_typescript.default.ScriptTarget.Latest);
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
        console.warn(`symbol ${name} is already in list with value ${symbols[name]}. Tried to add ${modulePath}.`);
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
  mergeSymbols
});
