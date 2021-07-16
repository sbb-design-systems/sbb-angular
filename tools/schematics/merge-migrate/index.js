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

// tools/schematics/merge-migrate/index.ts
__export(exports, {
  mergeMigrate: () => mergeMigrate
});
var import_core = __toModule(require("@angular-devkit/core"));
var import_schematics = __toModule(require("@angular-devkit/schematics"));
var import_tasks = __toModule(require("@angular-devkit/schematics/tasks"));
function mergeMigrate(options) {
  return (tree, context) => {
    if (!options.module) {
      context.logger.error(`Parameter --module [name] is required!`);
      return;
    }
    const businessModuleDirectory = tree.getDir(`src/angular-business/${options.module}`);
    const publicModuleDirectory = tree.getDir(`src/angular-public/${options.module}`);
    const targetDirectory = tree.getDir(`src/angular/${options.module}`);
    if (businessModuleDirectory.subfiles.length && businessModuleDirectory.subfiles.every((f) => f !== (0, import_core.fragment)(".gitignore"))) {
      migrateModule(businessModuleDirectory);
    } else if (publicModuleDirectory.subfiles.length) {
      migrateModule(publicModuleDirectory);
    } else {
      throw new import_schematics.SchematicsException(`Could not find module ${options.module}`);
    }
    context.addTask(new import_tasks.RunSchematicTask("bazel", { filter: "angular" }));
    context.logger.warn(`${options.module} migrated. Manual checks required!`);
    function migrateModule(directory) {
      const flatten = directory.subdirs.length <= 2;
      directory.visit((path, entry) => {
        if (entry) {
          let relativeTargetPath = (0, import_core.relative)(directory.path, path).replace(".component.", ".");
          if (flatten) {
            relativeTargetPath = (0, import_core.basename)(relativeTargetPath);
          }
          const targetPath = (0, import_core.join)(targetDirectory.path, relativeTargetPath);
          if (tree.exists(targetPath)) {
            context.logger.info(`${targetPath} already exists. Skipping...`);
          } else {
            let content = entry.content.toString().replace(/\.component'/g, `'`).replace(/\.component"/g, `"`).replace(/\.component\./g, ".").replace(/angular-public/g, "angular").replace(/angular-business/g, "angular").replace(/angular-core\/testing/g, "angular/core/testing").replace(/angular-core/g, "angular").replace(/\/base\//g, "/").replace(/@include publicOnly() /g, "/* TODO: Verify change */ html:not(.sbb-lean) & ").replace(/@include businessOnly() /g, "/* TODO: Verify change */ html.sbb-lean & ");
            if (flatten) {
              content = content.replace(/'\.\/[\w\/-]+\//g, `'./`).replace(/\.\.\//g, ".");
            }
            tree.create(targetPath, content);
          }
        }
      });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeMigrate
});
