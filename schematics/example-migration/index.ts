import { fragment, join, relative } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function exampleMigration(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const examples = tree.getDir('projects/angular-showcase/src/app/public/examples');
    const targetDir = tree.getDir('projects/angular-showcase/src/app/public/public-examples');
    const moduleFile = targetDir.file(fragment('public-examples.module.ts'));
    // tslint:disable-next-line: no-non-null-assertion
    let moduleContent = moduleFile!.content.toString('utf8');
    for (const dir of examples.subdirs) {
      const directory = examples.dir(dir);
      const renamed = `simple-${dir.replace('-showcase', '')}-example`;
      directory.visit((path, entry) => {
        if (entry) {
          const rel = relative(directory.path, path).replace(dir, renamed);
          const originalComponentName = componentName(dir);
          const renamedComponentName = componentName(renamed);
          const content = entry.content
            .toString('utf8')
            .replace(new RegExp(dir, 'g'), renamed)
            .replace(originalComponentName, renamedComponentName);
          const target = join(targetDir.path, renamed, rel);
          if (tree.exists(target)) {
            tree.overwrite(target, content);
          } else {
            tree.create(target, content);
            moduleContent = moduleContent
              .replace(`${dir}/${dir}.component`, `${renamed}/${renamed}.component`)
              .replace(new RegExp(originalComponentName, 'g'), renamedComponentName);
          }
        }
      });
    }

    // tslint:disable-next-line: no-non-null-assertion
    tree.overwrite(moduleFile!.path, moduleContent);
  };
}

function componentName(name: string) {
  const pascalCase = name.replace(/(^[a-z]|-[a-z])/g, m => m.replace('-', '').toUpperCase());
  return `${pascalCase}Component`;
}
