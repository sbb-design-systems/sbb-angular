import { basename, dirname, fragment, join, relative, strings } from '@angular-devkit/core';
import { DirEntry, FileEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
const prettier: {
  format: (source: string, options: { parser: string }) => string;
} = require('prettier');

export function normalizeExamples(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    class ExampleModule {
      readonly dirName = basename(this.dir.path);
      readonly packageShortName = basename(this.dir.parent!.path).split('-examples')[0];
      readonly packageName = `angular-${this.packageShortName}`;
      readonly moduleFile = this.dir.file(fragment(`${this.dirName}.module.ts`))!;
      readonly moduleShortName = basename(this.dir.path).split('-examples')[0];
      readonly exampleFiles: ExampleFileComponents[] = [];
      readonly imports: ModuleImport[] = [
        ModuleImport.fromPackageModule(this.packageName, this.moduleShortName),
      ];
      readonly angularModules = { forms: false, router: false };

      constructor(readonly dir: DirEntry) {
        dir.visit((path, entry) => {
          if (!entry) {
            return;
          } else if (
            path.endsWith('.ts') &&
            !path.endsWith('module.ts') &&
            !path.endsWith('spec.ts')
          ) {
            this.exampleFiles.push(new ExampleFileComponents(entry));
            this.imports.push(...ModuleImport.detectTypeScriptImports(entry));
            this.imports.push(...ModuleImport.detectHtmlTagUsages(entry, this.packageName));
          } else if (path.endsWith('.html')) {
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
        const moduleName = `${strings.classify(this.dirName)}Module`;

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
          ...require('../../../package.json').prettier,
        });

        if (this.moduleFile.content.toString() !== formattedContent) {
          tree.overwrite(this.moduleFile.path, formattedContent);
        }
      }

      private _renderModuleImports() {
        return this.imports.map((i) => `import { ${i.moduleName} } from '${i.path}';`).join('\n');
      }

      private _renderComponentImports() {
        return this.exampleFiles
          .map(
            (c) =>
              `import { ${c.components.join(', ')} } from './${relative(
                this.dir.path,
                c.entry.path
              ).replace(/\.ts$/, '')}';`
          )
          .join('\n');
      }

      private _renderComponentList() {
        return this.exampleFiles
          .reduce((current, next) => current.concat(next.components), [] as string[])
          .join(',\n  ');
      }

      private _renderExampleIndex() {
        const exampleIndex: { [key: string]: string } = {};
        const exampleIndexPart = this.moduleFile.content
          .toString()
          .match(/const EXAMPLE_INDEX = \{[^\}]+/m);
        if (exampleIndexPart) {
          const exampleRegex = /'([^']+)': (\w+)/gm;
          let match: RegExpExecArray | null;
          while ((match = exampleRegex.exec(exampleIndexPart[0]))) {
            exampleIndex[match[1]] = match[2];
          }
        }

        this.exampleFiles
          .map((e) => basename(dirname(e.entry.path)))
          .filter((e) => !exampleIndex[e])
          .forEach((e) => (exampleIndex[e] = `${strings.classify(e)}Component`));
        return Object.keys(exampleIndex)
          .map((e) => `  '${e}': ${exampleIndex[e]}`)
          .join(',\n');
      }

      private _renderModuleList() {
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
      readonly components =
        this.entry.content
          .toString()
          .match(/export class \w+Component/g)
          ?.map((m) => m.substring(13))
          .sort() ?? [];
      constructor(readonly entry: Readonly<FileEntry>) {}
    }

    class ModuleImport {
      constructor(readonly path: string, readonly moduleName: string) {}

      static fromPackageModule(packageName: string, moduleName: string, prefixed = false) {
        return new ModuleImport(
          `@sbb-esta/${packageName}/${moduleName}`,
          `${prefixed ? 'Sbb' : ''}${strings.classify(moduleName)}Module`
        );
      }

      static detectTypeScriptImports(entry: Readonly<FileEntry>): ModuleImport[] {
        const content = entry.content.toString();
        return (
          content
            .match(/@sbb-esta\/angular-\w+\/[^']+/g)
            ?.filter((v, i, a) => a.indexOf(v) === i)
            .filter((i) =>
              ['base', 'models', 'datetime', 'angular-core/radio-button'].every(
                (m) => !i.endsWith(`/${m}`)
              )
            )
            .map((i) => new ModuleImport(i, `${strings.classify(i.split('/')[2])}Module`)) ?? []
        );
      }

      static detectHtmlTagUsages(entry: Readonly<FileEntry>, packageName: string): ModuleImport[] {
        const content = entry.content.toString();
        const packageRoot = tree.getDir(`src/${packageName}`);
        const elementSelectors =
          content.match(/<sbb-[^ >]+/g)?.map((t) => t.substring(5).trim()) ?? [];
        const attributeSelectors =
          content
            .match(/ sbb[^= ><]+/g)
            ?.filter((m) => !m.includes('sbbsc') && !m.includes('sbb-label'))
            .map((t) =>
              t
                .substring(4)
                .trim()
                .replace(/^-/, '')
                .replace(/[A-Z]/g, (m, i) => `${i > 0 ? '-' : ''}${m.toLowerCase()}`)
                .replace(/^link$/, 'links')
            )
            .filter((m) => m !== 'input' && m !== 'icon') ?? [];
        const selectors = elementSelectors.concat(attributeSelectors);

        const imports = selectors
          .filter(
            (t) => t !== 'option' && t !== 'icon' && packageRoot.subdirs.includes(fragment(t))
          )
          .filter((v, i, a) => a.indexOf(v) === i)
          .map((i) => ModuleImport.fromPackageModule(packageName, i));
        if (selectors.some((s) => s === 'icon')) {
          imports.push(ModuleImport.fromPackageModule('angular-core', 'icon', true));
        }
        return imports;
      }
    }

    [
      'src/showcase/app/business/business-examples',
      'src/showcase/app/maps/maps-examples',
      'src/showcase/app/public/public-examples',
    ]
      .map((d) => tree.getDir(d))
      .forEach((d) => normalizeExampleModules(d));

    function normalizeExampleModules(dir: DirEntry) {
      dir.subdirs.map((d) => dir.dir(d)).forEach((d) => normalizeExampleModule(d));

      const dirName = basename(dir.path);
      const moduleName = `${strings.classify(dirName)}Module`;
      const moduleImports = dir.subdirs
        .sort()
        .map((d) => `import { ${strings.classify(d)}Module } from './${d}/${d}.module';`)
        .join('\n');
      const moduleList = dir.subdirs
        .sort()
        .map((d) => `${strings.classify(d)}Module`)
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
        ...require('../../../package.json').prettier,
      });

      const moduleFile = dir.file(fragment(`${dirName}.module.ts`))!;
      if (moduleFile.content.toString() !== formattedContent) {
        tree.overwrite(moduleFile.path, formattedContent);
      }
    }

    function normalizeExampleModule(dir: DirEntry) {
      renameShowcaseToExample(dir);
      new ExampleModule(dir).render();
    }

    function renameShowcaseToExample(dir: DirEntry) {
      dir.visit((path, entry) => {
        const relativePath = relative(dir.path, path);
        if (entry && relativePath.includes('showcase')) {
          const target = join(dir.path, relativePath.replace(/showcase/g, 'example'));
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
