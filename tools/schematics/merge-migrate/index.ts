import { basename, fragment, join, Path, relative } from '@angular-devkit/core';
import {
  DirEntry,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';

export function mergeMigrate(options: { module: string }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.module) {
      context.logger.error(`Parameter --module [name] is required!`);
      return;
    }

    const businessModuleDirectory = tree.getDir(`src/angular-business/${options.module}`);
    const publicModuleDirectory = tree.getDir(`src/angular-public/${options.module}`);
    const targetDirectory = tree.getDir(`src/angular/${options.module}`);

    if (
      businessModuleDirectory.subfiles.length &&
      businessModuleDirectory.subfiles.every((f) => f !== fragment('.gitignore'))
    ) {
      migrateModule(businessModuleDirectory);
    } else if (publicModuleDirectory.subfiles.length) {
      migrateModule(publicModuleDirectory);
    } else {
      throw new SchematicsException(`Could not find module ${options.module}`);
    }

    context.addTask(new RunSchematicTask('bazel', { filter: 'angular' }));
    context.logger.warn(`${options.module} migrated. Manual checks required!`);

    function migrateModule(directory: DirEntry) {
      const flatten = directory.subdirs.length <= 2;

      directory.visit((path, entry) => {
        if (entry) {
          let relativeTargetPath = relative(directory.path, path).replace(
            '.component.',
            '.'
          ) as Path;
          if (flatten) {
            relativeTargetPath = basename(relativeTargetPath);
          }

          const targetPath = join(targetDirectory.path, relativeTargetPath);
          if (tree.exists(targetPath)) {
            context.logger.info(`${targetPath} already exists. Skipping...`);
          } else {
            let content = entry.content
              .toString()
              .replace(/\.component'/g, `'`)
              .replace(/\.component"/g, `"`)
              .replace(/\.component\./g, '.')
              .replace(/angular-public/g, 'angular')
              .replace(/angular-business/g, 'angular')
              .replace(/angular-core\/testing/g, 'angular/core/testing')
              .replace(/angular-core/g, 'angular')
              .replace(/\/base\//g, '/')
              .replace(
                /@include publicOnly() /g,
                '/* TODO: Verify change */ html:not(.sbb-lean) & '
              )
              .replace(/@include businessOnly() /g, '/* TODO: Verify change */ html.sbb-lean & ');
            if (flatten) {
              content = content.replace(/'\.\/[\w\/-]+\//g, `'./`).replace(/\.\.\//g, '.');
            }
            tree.create(targetPath, content);
          }
        }
      });
    }
  };
}
