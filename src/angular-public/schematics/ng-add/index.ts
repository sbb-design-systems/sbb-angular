import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { addDefaultDependency, getPackageVersionFromPackageJson } from '../utils';

import { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (getPackageJsonDependency(host, '@sbb-esta/angular-business')) {
      context.logger.info(
        '@sbb-esta/angular-business is already installed, please set up @sbb-esta/angular-public manually'
      );
      return;
    }

    // Since the Angular SBB schematics depend on the schematic utility functions from the
    // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
    return addDependencies();
  };
}

const addDependencies = (): Rule => {
  return (tree: Tree, context: SchematicContext) => {
    const sbbAngularVersionRange =
      getPackageVersionFromPackageJson(tree, '@sbb-esta/angular-public') || `~0.0.0-PLACEHOLDER`;

    addDefaultDependency('@sbb-esta/angular-core', sbbAngularVersionRange, tree, context);
    addDefaultDependency('@sbb-esta/angular-icons', sbbAngularVersionRange, tree, context);
    addDefaultDependency('@angular/cdk', `0.0.0-CDK`, tree, context);
    addDefaultDependency(
      '@angular/animations',
      getPackageJsonDependency(tree, '@angular/core')!.version,
      tree,
      context
    );

    return tree;
  };
};
