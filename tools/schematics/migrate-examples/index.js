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

// tools/schematics/migrate-examples/index.ts
__export(exports, {
  migrateExamples: () => migrateExamples
});
var import_core = __toModule(require("@angular-devkit/core"));
var import_schematics = __toModule(require("@angular-devkit/schematics"));
var import_tasks = __toModule(require("@angular-devkit/schematics/tasks"));
var import_fs = __toModule(require("fs"));
var import_tslint = __toModule(require("tslint"));
var prettier = require("prettier");
function lintFix(content) {
  const linter = new import_tslint.Linter({
    fix: true
  });
  const configuration = import_tslint.Configuration.findConfiguration("tslint.json").results;
  const tempFileName = ".tempfile";
  linter.lint(tempFileName, content, configuration);
  content = (0, import_fs.readFileSync)(tempFileName, "utf8");
  (0, import_fs.unlinkSync)(tempFileName);
  return content;
}
function migrateExamples(options) {
  return (tree, context) => {
    if (!options.module) {
      throw new import_schematics.SchematicsException("--module [module] is required!");
    } else if (options.module.match(/-examples$/)) {
      options.module = options.module.replace(/-examples$/, "");
      context.logger.warn(`Normalized ${options.module}-examples to ${options.module}`);
    }
    const publicExamplesDir = tree.getDir(`src/showcase/app/public/public-examples/${options.module}-examples`);
    const businessExamplesDir = tree.getDir(`src/showcase/app/business/business-examples/${options.module}-examples`);
    if (!publicExamplesDir.subfiles.length && !businessExamplesDir.subfiles.length) {
      context.logger.warn(`No examples found for ${options.module}`);
      return;
    }
    const targetDir = tree.getDir(`src/components-examples/angular/${options.module}`);
    if (targetDir.subfiles.length) {
      context.logger.warn(`${options.module} is already migrated`);
      return;
    }
    let order = 0;
    tree.create((0, import_core.join)(targetDir.path, "BUILD.bazel"), "");
    [publicExamplesDir, businessExamplesDir].forEach((exampleDir) => {
      exampleDir.visit((path, entry) => {
        if (path.endsWith("BUILD.bazel")) {
        } else if (path.endsWith(".module.ts")) {
          migrateModuleDeclaration(entry);
        } else {
          migrateExampleFile(entry, exampleDir.path);
        }
      });
    });
    context.addTask(new import_tasks.RunSchematicTask("bazel", { filter: "components-examples" }));
    function migrateModuleDeclaration(entry) {
      let content = entry.content.toString().replace(/  providers: \[provideExamples\('[^']+', '[^']+', EXAMPLE_INDEX\)\],\n/, "").replace(/\nimport \{ provideExamples \} from '..\/..\/..\/shared\/example-provider';\n/, "").replace(/const EXAMPLE_INDEX = \{[^\}]+\};\n/, "").replace(/-example\//g, "/").replace(/.component'/g, `'`).replace(/ExampleComponent/g, "Example").replace(new RegExp(`angular-(business|public)\\/${options.module}`, "g"), `angular/${options.module}`);
      const exportDeclaration = `export {${content.match(/const EXAMPLES = \[(.*)\];\n/s)[1]}};

`;
      const exportDeclarationInserPosition = content.indexOf("const EXAMPLES");
      content = content.slice(0, exportDeclarationInserPosition) + exportDeclaration + content.slice(exportDeclarationInserPosition);
      content = prettier.format(lintFix(content), {
        parser: "typescript",
        ...require("../../../package.json").prettier
      });
      const indexPath = (0, import_core.join)(targetDir.path, "index.ts");
      if (tree.exists(indexPath)) {
        context.logger.warn(`${(0, import_core.basename)(indexPath)} already exists (probably from public). Manual merge of ${(0, import_core.basename)(entry.path)} required.`);
      } else {
        tree.create((0, import_core.join)(targetDir.path, "index.ts"), content);
      }
    }
    function migrateExampleFile(entry, root) {
      const adaptedPath = (0, import_core.relative)(root, entry.path).replace(/-example\//, "/").replace(".component", "").replace(".scss", ".css");
      const targetPath = (0, import_core.join)(targetDir.path, adaptedPath);
      if (entry.path.endsWith(".scss")) {
        context.logger.warn(`Changed ${entry.path} to ${targetPath}, since examples don't support scss`);
      }
      let content = entry.content.toString().replace(/.component./g, ".").replace(/ExampleComponent/g, "Example");
      if (entry.path.endsWith(".ts")) {
        const title = (0, import_core.basename)(targetPath).replace(/-example.ts$/, "").replace(/(^\w|-\w)/g, (m) => m.replace("-", " ").toUpperCase());
        content = content.replace("@Component", `/**
 * @title ${title}
 * @order ${++order * 10}
 */
@Component`).replace(new RegExp(`angular-(business|public)\\/${options.module}`, "g"), `angular/${options.module}`);
        content = prettier.format(content, {
          parser: "typescript",
          ...require("../../../package.json").prettier
        });
      }
      if (tree.exists(targetPath)) {
        context.logger.warn(`${targetPath} already exists (probably from public). Manual check of ${entry.path} recommended.`);
      } else {
        tree.create(targetPath, content);
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  migrateExamples
});
