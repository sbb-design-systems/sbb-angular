import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';

import { ApplicationIconModuleGenerator } from './application-icon-module-generator';
import { IconModuleCollection } from './icon-module-collection';
import { IconModuleFactory } from './icon-module-factory';
import { LibraryIconModuleGenerator } from './library-icon-module-generator';
import { Schema } from './schema';

export function svgIcons(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<Rule> => {
    const registryFileEntry = tree.get(options.svgRegistry);
    if (!registryFileEntry) {
      throw new SchematicsException(
        `Svg registry file is required to exist! (${options.svgRegistry})`
      );
    }

    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const iconModules = await new IconModuleFactory(tree, registryFileEntry).createIconModules();
    const duplicates = iconModules
      .map(i => i.normalizedName)
      .filter((n, i, a) => a.findIndex(m => m === n) === i && a.filter(m => m === n).length > 1);
    if (duplicates.length) {
      throw new SchematicsException(`Duplicate normalized names found: ${duplicates.join(', ')}`);
    }

    const rootCollection = new IconModuleCollection().addAll(iconModules);
    if (project.projectType === 'library') {
      context.logger.info(
        `Detected project type library for project ${options.project}. Building icons as secondary entrypoints.`
      );

      const rules = new LibraryIconModuleGenerator(
        rootCollection,
        tree,
        project,
        options.targetDir
      ).generate();
      return chain(rules);
    } else {
      context.logger.info(`Detected project type application for project ${options.project}.`);
      const rules = new ApplicationIconModuleGenerator(
        rootCollection,
        tree,
        project,
        options.targetDir
      ).generate();
      return chain(rules);
    }
  };
}
