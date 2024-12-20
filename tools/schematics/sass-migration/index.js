var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// tools/schematics/sass-migration/index.ts
var index_exports = {};
__export(index_exports, {
  sassMigration: () => sassMigration
});
module.exports = __toCommonJS(index_exports);
var import_core = require("@angular-devkit/core");
function sassMigration() {
  return (tree) => {
    const symbols = [];
    tree.getDir("src/angular/styles").visit((path) => {
      if (path.endsWith(".scss") && !path.includes("typography")) {
        symbols.push(...createSymbolsFor(path, "sbb"));
      }
    });
    tree.getDir("src").visit((path, entry) => {
      if (path.endsWith(".scss") && (!path.includes("src/angular/styles") || path.includes("_typography.scss")) && entry) {
        let content = entry.content.toString();
        const regex = /@import '(..\/)+(angular\/)?styles\/common';/;
        if (!regex.test(content)) {
          return;
        }
        content = content.replace(regex, `@use '@sbb-esta/angular' as sbb;`);
        const localSymbols = [...symbols];
        content = content.replace(/@import '([^']+)';/g, (...m) => {
          const importPath = (0, import_core.join)(
            (0, import_core.dirname)(path),
            `${m[1].replace(/[\w\-\_]+$/, (im) => `_${im}`)}.scss`
          );
          localSymbols.push(...createSymbolsFor(importPath));
          return `@use '${m[1]}';`;
        });
        content = localSymbols.reduce((current, next) => next(current), content);
        if (entry.content.toString() !== content) {
          tree.overwrite(path, content);
        }
      }
    });
    function createSymbolsFor(file, name = (0, import_core.basename)(file).replace(/(^_|.scss$)/g, "")) {
      const fileSymbols = [];
      const lines = tree.read(file).toString().split("\n");
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (["*", "/*", "//"].some((p) => trimmedLine.startsWith(p))) {
          continue;
        }
        const [_match, _group, sassVariable, sassFunction, sassMixin] = trimmedLine.match(/((\$[\w\-\_]+):|@function ([\w\-\_]+)|@mixin ([\w\-\_]+))/) ?? [];
        if (sassVariable || sassFunction) {
          const escapedValue = (sassVariable ?? sassFunction).replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          fileSymbols.push(
            (content) => content.replace(
              new RegExp(`(\\W)(${escapedValue}\\W)`, "g"),
              (...m) => `${m[1]}${name}.${m[2]}`
            )
          );
        } else if (sassMixin) {
          fileSymbols.push(
            (content) => content.replace(
              new RegExp(`include (${sassMixin}\\W)`, "g"),
              (...m) => `include ${name}.${m[1]}`
            )
          );
        }
      }
      return fileSymbols;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sassMigration
});
