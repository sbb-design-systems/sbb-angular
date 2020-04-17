import { basename, dirname, fragment, join, relative, split, strings } from '@angular-devkit/core';
import { DirEntry, FileEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
const prettier: {
  format: (source: string, options: { parser: string }) => string;
} = require('prettier');

interface ExampleComponents {
  path: string;
  components: string[];
}
interface Imports {
  path: string;
  moduleName: string;
}

export function normalizeExamples(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const iconLookup: { [key: string]: Imports } = {};
    const iconsDir = tree.getDir('src/icons');
    iconsDir.visit(path => {
      const fileName = basename(path);
      if (fileName.endsWith('.module.ts') && fileName.startsWith('icon-')) {
        const key = fileName.split('.')[0];
        iconLookup[key] = {
          path: `@sbb-esta/angular-icons/${relative(iconsDir.path, dirname(path))}`,
          moduleName: `${strings.classify(key)}Module`
        };
      }
    });

    [
      'src/showcase/app/business/business-examples',
      'src/showcase/app/maps/maps-examples',
      'src/showcase/app/public/public-examples'
    ]
      .map(d => tree.getDir(d))
      .forEach(d => normalizeExampleModules(d));

    function normalizeExampleModules(dir: DirEntry) {
      // const moduleName = basename(dir.parent!.path);
      dir.subdirs.map(d => dir.dir(d)).forEach(d => normalizeExampleModule(d));

      const dirName = basename(dir.path);
      const moduleName = `${strings.classify(dirName)}Module`;
      const moduleImports = dir.subdirs
        .sort()
        .map(d => `import { ${strings.classify(d)}Module } from './${d}/${d}.module';`)
        .join('\n');
      const moduleList = dir.subdirs.map(d => `${strings.classify(d)}Module`).join(',\n  ');
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
        ...require('../../package.json').prettier
      });

      const moduleFile = dir.file(fragment(`${dirName}.module.ts`))!;
      if (moduleFile.content.toString() !== formattedContent) {
        tree.overwrite(moduleFile.path, formattedContent);
      }
    }

    function normalizeExampleModule(dir: DirEntry) {
      renameShowcaseToExample(dir);
      renderModuleContent(dir);
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

    function renderModuleContent(dir: DirEntry) {
      const { exampleComponents, imports } = findExampleComponentsAndImports(dir);
      const dirName = basename(dir.path);
      const angularModules = detectUsedAngularModules(dir);
      const formImport = angularModules.forms
        ? `import { FormsModule, ReactiveFormsModule } from '@angular/forms';`
        : '';
      const routerImport = angularModules.router
        ? `import { RouterModule } from '@angular/router';`
        : '';
      const moduleName = `${strings.classify(dirName)}Module`;
      const moduleImports = imports
        .map(i => `import { ${i.moduleName} } from '${i.path}';`)
        .join('\n');
      const componentImports = exampleComponents
        .map(c => `import { ${c.components.join(', ')} } from '${c.path}';`)
        .join('\n');
      const componentsList = exampleComponents
        .reduce((current, next) => current.concat(next.components), [] as string[])
        .join(',\n  ');
      let moduleList = imports.map(i => i.moduleName).join(',\n    ');
      if (angularModules.forms) {
        moduleList = `FormsModule,\n  ReactiveFormsModule,\n  ${moduleList}`;
      }
      if (angularModules.router) {
        moduleList = `RouterModule,\n  ${moduleList}`;
      }

      const content = `import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';${formImport}${routerImport}
${moduleImports}

${componentImports}

const EXAMPLES = [
  ${componentsList}
];

@NgModule({
  imports: [
    CommonModule,
    ${moduleList}
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ${moduleName} {}
`;
      const formattedContent = prettier.format(content, {
        parser: 'typescript',
        ...require('../../package.json').prettier
      });

      const moduleFile = dir.file(fragment(`${dirName}.module.ts`))!;
      if (moduleFile.content.toString() !== formattedContent) {
        tree.overwrite(moduleFile.path, formattedContent);
      }
    }

    function findExampleComponentsAndImports(dir: DirEntry) {
      const packageName = split(dir.path)[4];
      const exampleComponents: ExampleComponents[] = [];
      const moduleName = basename(dir.path).split('-examples')[0];
      const imports: Imports[] = [resolveImport(packageName, moduleName)];
      dir.visit((path, entry) => {
        if (!entry) {
          return;
        } else if (path.endsWith('.ts') && !path.endsWith('module.ts')) {
          exampleComponents.push(...findComponents(dir, entry));
          imports.push(...findTypeScriptImports(entry));
        } else if (path.endsWith('.html')) {
          imports.push(...findHtmlTagUsages(entry, packageName));
        }
      });

      return {
        exampleComponents: exampleComponents
          .filter((v, i, a) => a.findIndex(vi => JSON.stringify(vi) === JSON.stringify(v)) === i)
          .sort((a, b) => a.path.localeCompare(b.path)),
        imports: imports
          .filter((v, i, a) => a.findIndex(vi => JSON.stringify(vi) === JSON.stringify(v)) === i)
          .sort((a, b) => a.path.localeCompare(b.path))
      };
    }

    function findComponents(dir: DirEntry, entry: Readonly<FileEntry>): ExampleComponents[] {
      const content = entry.content.toString();
      const components = content
        .match(/export class \w+Component/g)
        ?.map(m => m.substring(13))
        .sort();
      return components
        ? [{ path: `./${relative(dir.path, entry.path).replace(/\.ts$/, '')}`, components }]
        : [];
    }

    function findTypeScriptImports(entry: Readonly<FileEntry>): Imports[] {
      const content = entry.content.toString();
      return (
        content
          .match(/@sbb-esta\/angular-\w+\/[^']+/g)
          ?.filter((v, i, a) => a.indexOf(v) === i)
          .filter(i =>
            ['base', 'models', 'datetime', 'angular-core/radio-button'].every(
              m => !i.endsWith(`/${m}`)
            )
          )
          .map(i => ({ path: i, moduleName: `${strings.classify(i.split('/')[2])}Module` })) ?? []
      );
    }

    function findHtmlTagUsages(entry: Readonly<FileEntry>, packageName: string): Imports[] {
      const content = entry.content.toString();
      const packageRoot = tree.getDir(`src/${packageName}`);

      return (
        content
          .match(/<sbb-[^ >]+/g)
          ?.map(t => t.substring(5).trim())
          .filter(
            t =>
              t !== 'option' && (packageRoot.subdirs.includes(fragment(t)) || t.startsWith('icon'))
          )
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(i =>
            i.startsWith('icon') ? resolveIconImport(i) : resolveImport(packageName, i)
          ) ?? []
      );
    }

    function resolveIconImport(tagName: string) {
      return iconLookup[tagName];
    }

    function resolveImport(packageName: string, moduleName: string) {
      return {
        path: `@sbb-esta/angular-${packageName}/${moduleName}`,
        moduleName: `${strings.classify(moduleName)}Module`
      };
    }

    function detectUsedAngularModules(dir: DirEntry) {
      const modules = {
        forms: false,
        router: false
      };
      dir.visit((path, entry) => {
        if (path.endsWith('html') && entry) {
          const content = entry.content.toString();
          if (content.match(/(ngModel|formGroup|formControl)/)) {
            modules.forms = true;
          }

          if (content.includes('routerLink')) {
            modules.router = true;
          }
        }
      });

      return modules;
    }
  };
}
