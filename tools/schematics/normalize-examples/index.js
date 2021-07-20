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

// tools/schematics/normalize-examples/index.ts
__export(exports, {
  normalizeExamples: () => normalizeExamples
});
var import_core = __toModule(require("@angular-devkit/core"));
var prettier = require("prettier");
function normalizeExamples() {
  return (tree, _context) => {
    var _a, _b;
    class ExampleModule {
      constructor(dir) {
        this.dir = dir;
        this.dirName = (0, import_core.basename)(this.dir.path);
        this.packageShortName = (0, import_core.basename)(this.dir.parent.path).split("-examples")[0];
        this.packageName = `angular-${this.packageShortName}`;
        this.moduleFile = this.dir.file((0, import_core.fragment)(`${this.dirName}.module.ts`));
        this.moduleShortName = (0, import_core.basename)(this.dir.path).split("-examples")[0];
        this.exampleFiles = [];
        this.imports = [
          ModuleImport.fromPackageModule(this.packageName, this.moduleShortName)
        ];
        this.angularModules = { forms: false, router: false };
        dir.visit((path, entry) => {
          if (!entry) {
            return;
          } else if (path.endsWith(".ts") && !path.endsWith("module.ts") && !path.endsWith("spec.ts")) {
            this.exampleFiles.push(new ExampleFileComponents(entry));
            this.imports.push(...ModuleImport.detectTypeScriptImports(entry));
            this.imports.push(...ModuleImport.detectHtmlTagUsages(entry, this.packageName));
          } else if (path.endsWith(".html")) {
            this.imports.push(...ModuleImport.detectHtmlTagUsages(entry, this.packageName));
            const content = entry.content.toString();
            if (content.match(/(ngModel|formGroup|formControl)/)) {
              this.angularModules.forms = true;
            }
            if (content.includes("routerLink")) {
              this.angularModules.router = true;
            }
          }
        });
        this.exampleFiles = this.exampleFiles.filter((v, i, a) => a.findIndex((vi) => vi.entry.path === v.entry.path) === i).sort((a, b) => a.entry.path.localeCompare(b.entry.path));
        this.imports = this.imports.filter((v, i, a) => a.findIndex((vi) => vi.moduleName === v.moduleName) === i).sort((a, b) => a.path.localeCompare(b.path));
      }
      render() {
        const formImport = this.angularModules.forms ? `import { FormsModule, ReactiveFormsModule } from '@angular/forms';` : "";
        const routerImport = this.angularModules.router ? `import { RouterModule } from '@angular/router';` : "";
        const moduleName = `${import_core.strings.classify(this.dirName)}Module`;
        const content = `import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';${formImport}${routerImport}
${this._renderModuleImports()}

import { provideExamples } from '../../../shared/example-provider';

${this._renderComponentImports()}

const EXAMPLES = [
  ${this._renderComponentList()}
];

const EXAMPLE_INDEX = {
  ${this._renderExampleIndex()}
};

@NgModule({
  imports: [
    CommonModule,
    ${this._renderModuleList()}
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('${this.packageShortName}', '${this.moduleShortName}', EXAMPLE_INDEX)]
})
export class ${moduleName} {}
`;
        const formattedContent = prettier.format(content, {
          parser: "typescript",
          ...require("../../../package.json").prettier
        });
        if (this.moduleFile.content.toString() !== formattedContent) {
          tree.overwrite(this.moduleFile.path, formattedContent);
        }
      }
      _renderModuleImports() {
        return this.imports.map((i) => `import { ${i.moduleName} } from '${i.path}';`).join("\n");
      }
      _renderComponentImports() {
        return this.exampleFiles.map((c) => `import { ${c.components.join(", ")} } from './${(0, import_core.relative)(this.dir.path, c.entry.path).replace(/\.ts$/, "")}';`).join("\n");
      }
      _renderComponentList() {
        return this.exampleFiles.reduce((current, next) => current.concat(next.components), []).join(",\n  ");
      }
      _renderExampleIndex() {
        const exampleIndex = {};
        const exampleIndexPart = this.moduleFile.content.toString().match(/const EXAMPLE_INDEX = \{[^\}]+/m);
        if (exampleIndexPart) {
          const exampleRegex = /'([^']+)': (\w+)/gm;
          let match;
          while (match = exampleRegex.exec(exampleIndexPart[0])) {
            exampleIndex[match[1]] = match[2];
          }
        }
        this.exampleFiles.map((e) => (0, import_core.basename)((0, import_core.dirname)(e.entry.path))).filter((e) => !exampleIndex[e]).forEach((e) => exampleIndex[e] = `${import_core.strings.classify(e)}Component`);
        return Object.keys(exampleIndex).map((e) => `  '${e}': ${exampleIndex[e]}`).join(",\n");
      }
      _renderModuleList() {
        let moduleList = this.imports.map((i) => i.moduleName).join(",\n    ");
        if (this.angularModules.forms) {
          moduleList = `FormsModule,
  ReactiveFormsModule,
  ${moduleList}`;
        }
        if (this.angularModules.router) {
          moduleList = `RouterModule,
  ${moduleList}`;
        }
        return moduleList;
      }
    }
    class ExampleFileComponents {
      constructor(entry) {
        this.entry = entry;
        this.components = (_b = (_a = this.entry.content.toString().match(/export class \w+Component/g)) == null ? void 0 : _a.map((m) => m.substring(13)).sort()) != null ? _b : [];
      }
    }
    class ModuleImport {
      constructor(path, moduleName) {
        this.path = path;
        this.moduleName = moduleName;
      }
      static fromPackageModule(packageName, moduleName, prefixed = false) {
        return new ModuleImport(`@sbb-esta/${packageName}/${moduleName}`, `${prefixed ? "Sbb" : ""}${import_core.strings.classify(moduleName)}Module`);
      }
      static detectTypeScriptImports(entry) {
        var _a2, _b2;
        const content = entry.content.toString();
        return (_b2 = (_a2 = content.match(/@sbb-esta\/angular-\w+\/[^']+/g)) == null ? void 0 : _a2.filter((v, i, a) => a.indexOf(v) === i).filter((i) => ["base", "models", "datetime", "angular-core/radio-button"].every((m) => !i.endsWith(`/${m}`))).map((i) => new ModuleImport(i, `${import_core.strings.classify(i.split("/")[2])}Module`))) != null ? _b2 : [];
      }
      static detectHtmlTagUsages(entry, packageName) {
        var _a2, _b2, _c, _d;
        const content = entry.content.toString();
        const packageRoot = tree.getDir(`src/${packageName}`);
        const elementSelectors = (_b2 = (_a2 = content.match(/<sbb-[^ >]+/g)) == null ? void 0 : _a2.map((t) => t.substring(5).trim())) != null ? _b2 : [];
        const attributeSelectors = (_d = (_c = content.match(/ sbb[^= ><]+/g)) == null ? void 0 : _c.filter((m) => !m.includes("sbbsc") && !m.includes("sbb-label")).map((t) => t.substring(4).trim().replace(/^-/, "").replace(/[A-Z]/g, (m, i) => `${i > 0 ? "-" : ""}${m.toLowerCase()}`).replace(/^link$/, "links")).filter((m) => m !== "input" && m !== "icon")) != null ? _d : [];
        const selectors = elementSelectors.concat(attributeSelectors);
        const imports = selectors.filter((t) => t !== "option" && t !== "icon" && packageRoot.subdirs.includes((0, import_core.fragment)(t))).filter((v, i, a) => a.indexOf(v) === i).map((i) => ModuleImport.fromPackageModule(packageName, i));
        if (selectors.some((s) => s === "icon")) {
          imports.push(ModuleImport.fromPackageModule("angular-core", "icon", true));
        }
        return imports;
      }
    }
    [
      "src/showcase/app/business/business-examples",
      "src/showcase/app/maps/maps-examples",
      "src/showcase/app/public/public-examples"
    ].map((d) => tree.getDir(d)).forEach((d) => normalizeExampleModules(d));
    function normalizeExampleModules(dir) {
      dir.subdirs.map((d) => dir.dir(d)).forEach((d) => normalizeExampleModule(d));
      const dirName = (0, import_core.basename)(dir.path);
      const moduleName = `${import_core.strings.classify(dirName)}Module`;
      const moduleImports = dir.subdirs.sort().map((d) => `import { ${import_core.strings.classify(d)}Module } from './${d}/${d}.module';`).join("\n");
      const moduleList = dir.subdirs.sort().map((d) => `${import_core.strings.classify(d)}Module`).join(",\n  ");
      const content = `import { NgModule } from '@angular/core';

${moduleImports}

const EXAMPLES = [
  ${moduleList}
];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES
})
export class ${moduleName} {}
`;
      const formattedContent = prettier.format(content, {
        parser: "typescript",
        ...require("../../../package.json").prettier
      });
      const moduleFile = dir.file((0, import_core.fragment)(`${dirName}.module.ts`));
      if (moduleFile.content.toString() !== formattedContent) {
        tree.overwrite(moduleFile.path, formattedContent);
      }
    }
    function normalizeExampleModule(dir) {
      renameShowcaseToExample(dir);
      new ExampleModule(dir).render();
    }
    function renameShowcaseToExample(dir) {
      dir.visit((path, entry) => {
        const relativePath = (0, import_core.relative)(dir.path, path);
        if (entry && relativePath.includes("showcase")) {
          const target = (0, import_core.join)(dir.path, relativePath.replace(/showcase/g, "example"));
          const content = entry.content.toString().replace(/showcase/g, "example").replace(/Showcase/g, "Example").replace(/SHOWCASE/g, "EXAMPLE");
          tree.delete(path);
          tree.create(target, content);
        }
      });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  normalizeExamples
});
