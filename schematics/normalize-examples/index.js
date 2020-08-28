'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');

const prettier = require('prettier');
function normalizeExamples() {
    return (tree, _context) => {
        class ExampleModule {
            constructor(dir) {
                this.dir = dir;
                this.dirName = core.basename(this.dir.path);
                this.packageShortName = core.basename(this.dir.parent.path).split('-examples')[0];
                this.packageName = `angular-${this.packageShortName}`;
                this.moduleFile = this.dir.file(core.fragment(`${this.dirName}.module.ts`));
                this.moduleShortName = core.basename(this.dir.path).split('-examples')[0];
                this.exampleFiles = [];
                this.imports = [
                    ModuleImport.fromPackageModule(this.packageName, this.moduleShortName),
                ];
                this.angularModules = { forms: false, router: false };
                dir.visit((path, entry) => {
                    if (!entry) {
                        return;
                    }
                    else if (path.endsWith('.ts') &&
                        !path.endsWith('module.ts') &&
                        !path.endsWith('spec.ts')) {
                        this.exampleFiles.push(new ExampleFileComponents(entry));
                        this.imports.push(...ModuleImport.detectTypeScriptImports(entry));
                        this.imports.push(...ModuleImport.detectHtmlTagUsages(entry, this.packageName));
                    }
                    else if (path.endsWith('.html')) {
                        this.imports.push(...ModuleImport.detectHtmlTagUsages(entry, this.packageName));
                        const content = entry.content.toString();
                        if (content.match(/(ngModel|formGroup|formControl)/)) {
                            this.angularModules.forms = true;
                        }
                        if (content.includes('routerLink')) {
                            this.angularModules.router = true;
                        }
                    }
                });
                this.exampleFiles = this.exampleFiles
                    .filter((v, i, a) => a.findIndex((vi) => vi.entry.path === v.entry.path) === i)
                    .sort((a, b) => a.entry.path.localeCompare(b.entry.path));
                this.imports = this.imports
                    .filter((v, i, a) => a.findIndex((vi) => vi.moduleName === v.moduleName) === i)
                    .sort((a, b) => a.path.localeCompare(b.path));
            }
            render() {
                const formImport = this.angularModules.forms
                    ? `import { FormsModule, ReactiveFormsModule } from '@angular/forms';`
                    : '';
                const routerImport = this.angularModules.router
                    ? `import { RouterModule } from '@angular/router';`
                    : '';
                const moduleName = `${core.strings.classify(this.dirName)}Module`;
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
                    parser: 'typescript',
                    ...require('../../package.json').prettier,
                });
                if (this.moduleFile.content.toString() !== formattedContent) {
                    tree.overwrite(this.moduleFile.path, formattedContent);
                }
            }
            _renderModuleImports() {
                return this.imports.map((i) => `import { ${i.moduleName} } from '${i.path}';`).join('\n');
            }
            _renderComponentImports() {
                return this.exampleFiles
                    .map((c) => `import { ${c.components.join(', ')} } from './${core.relative(this.dir.path, c.entry.path).replace(/\.ts$/, '')}';`)
                    .join('\n');
            }
            _renderComponentList() {
                return this.exampleFiles
                    .reduce((current, next) => current.concat(next.components), [])
                    .join(',\n  ');
            }
            _renderExampleIndex() {
                const exampleIndex = {};
                const exampleIndexPart = this.moduleFile.content
                    .toString()
                    .match(/const EXAMPLE_INDEX = \{[^\}]+/m);
                if (exampleIndexPart) {
                    const exampleRegex = /'([^']+)': (\w+)/gm;
                    let match;
                    while ((match = exampleRegex.exec(exampleIndexPart[0]))) {
                        exampleIndex[match[1]] = match[2];
                    }
                }
                this.exampleFiles
                    .map((e) => core.basename(core.dirname(e.entry.path)))
                    .filter((e) => !exampleIndex[e])
                    .forEach((e) => (exampleIndex[e] = `${core.strings.classify(e)}Component`));
                return Object.keys(exampleIndex)
                    .map((e) => `  '${e}': ${exampleIndex[e]}`)
                    .join(',\n');
            }
            _renderModuleList() {
                let moduleList = this.imports.map((i) => i.moduleName).join(',\n    ');
                if (this.angularModules.forms) {
                    moduleList = `FormsModule,\n  ReactiveFormsModule,\n  ${moduleList}`;
                }
                if (this.angularModules.router) {
                    moduleList = `RouterModule,\n  ${moduleList}`;
                }
                return moduleList;
            }
        }
        class ExampleFileComponents {
            constructor(entry) {
                var _a, _b;
                this.entry = entry;
                this.components = (_b = (_a = this.entry.content
                    .toString()
                    .match(/export class \w+Component/g)) === null || _a === void 0 ? void 0 : _a.map((m) => m.substring(13)).sort()) !== null && _b !== void 0 ? _b : [];
            }
        }
        class ModuleImport {
            constructor(path, moduleName) {
                this.path = path;
                this.moduleName = moduleName;
            }
            static fromPackageModule(packageName, moduleName) {
                return new ModuleImport(`@sbb-esta/${packageName}/${moduleName}`, `${core.strings.classify(moduleName)}Module`);
            }
            static detectTypeScriptImports(entry) {
                var _a, _b;
                const content = entry.content.toString();
                return ((_b = (_a = content
                    .match(/@sbb-esta\/angular-\w+\/[^']+/g)) === null || _a === void 0 ? void 0 : _a.filter((v, i, a) => a.indexOf(v) === i).filter((i) => ['base', 'models', 'datetime', 'angular-core/radio-button'].every((m) => !i.endsWith(`/${m}`))).map((i) => new ModuleImport(i, `${core.strings.classify(i.split('/')[2])}Module`))) !== null && _b !== void 0 ? _b : []);
            }
            static detectHtmlTagUsages(entry, packageName) {
                var _a, _b, _c, _d;
                const content = entry.content.toString();
                const packageRoot = tree.getDir(`src/${packageName}`);
                const elementSelectors = (_b = (_a = content.match(/<sbb-[^ >]+/g)) === null || _a === void 0 ? void 0 : _a.map((t) => t.substring(5).trim())) !== null && _b !== void 0 ? _b : [];
                const attributeSelectors = (_d = (_c = content
                    .match(/ sbb[^= ><]+/g)) === null || _c === void 0 ? void 0 : _c.filter((m) => !m.includes('sbbsc') && !m.includes('sbb-label')).map((t) => t
                    .substring(4)
                    .trim()
                    .replace(/^-/, '')
                    .replace(/[A-Z]/g, (m, i) => `${i > 0 ? '-' : ''}${m.toLowerCase()}`)
                    .replace(/^link$/, 'links')).filter((m) => m !== 'input' && m !== 'icon')) !== null && _d !== void 0 ? _d : [];
                const selectors = elementSelectors.concat(attributeSelectors);
                return selectors
                    .filter((t) => t !== 'option' && (packageRoot.subdirs.includes(core.fragment(t)) || t.startsWith('icon')))
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((i) => ModuleImport.fromPackageModule(packageName, i));
            }
        }
        [
            'src/showcase/app/business/business-examples',
            'src/showcase/app/maps/maps-examples',
            'src/showcase/app/public/public-examples',
        ]
            .map((d) => tree.getDir(d))
            .forEach((d) => normalizeExampleModules(d));
        function normalizeExampleModules(dir) {
            dir.subdirs.map((d) => dir.dir(d)).forEach((d) => normalizeExampleModule(d));
            const dirName = core.basename(dir.path);
            const moduleName = `${core.strings.classify(dirName)}Module`;
            const moduleImports = dir.subdirs
                .sort()
                .map((d) => `import { ${core.strings.classify(d)}Module } from './${d}/${d}.module';`)
                .join('\n');
            const moduleList = dir.subdirs
                .sort()
                .map((d) => `${core.strings.classify(d)}Module`)
                .join(',\n  ');
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
                parser: 'typescript',
                ...require('../../package.json').prettier,
            });
            const moduleFile = dir.file(core.fragment(`${dirName}.module.ts`));
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
                const relativePath = core.relative(dir.path, path);
                if (entry && relativePath.includes('showcase')) {
                    const target = core.join(dir.path, relativePath.replace(/showcase/g, 'example'));
                    const content = entry.content
                        .toString()
                        .replace(/showcase/g, 'example')
                        .replace(/Showcase/g, 'Example')
                        .replace(/SHOWCASE/g, 'EXAMPLE');
                    tree.delete(path);
                    tree.create(target, content);
                }
            });
        }
    };
}

exports.normalizeExamples = normalizeExamples;
