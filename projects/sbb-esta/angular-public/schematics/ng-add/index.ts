import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { addDefaultDependency, getPackageVersionFromPackageJson } from '../utils';

import { Schema } from './schema';

export const TYPOGRAPHY_CSS_PATH = 'node_modules/@sbb-esta/angular-public/typography.css';

/** Name of the Angular module that enables Angular browser animations. */
export const BROWSER_ANIMATIONS_MODULE_NAME = 'BrowserAnimationsModule';

/** Name of the module that switches Angular animations to a noop implementation. */
export const NOOP_ANIMATIONS_MODULE_NAME = 'NoopAnimationsModule';

export function ngAdd(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    assertBusinessNotInstalled(host);
    addDependencies(host, context);

    // Since the Angular Material schematics depend on the schematic utility functions from the
    // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
  };
}

const assertBusinessNotInstalled = (tree: Tree) => {
  if (getPackageJsonDependency(tree, '@sbb-esta/angular-business')) {
    throw new SchematicsException(
      '@sbb-esta/angular-business is already installed, please add @sbb-esta/angular-public dependency manually if you like to proceed.'
    );
  }
};

const addDependencies = (tree: Tree, context: SchematicContext): Tree => {
  const sbbAngularVersionRange =
    getPackageVersionFromPackageJson(tree, '@sbb-esta/angular-public') ||
    require('../../package.json').version;

  addDefaultDependency('@sbb-esta/angular-core', sbbAngularVersionRange, tree, context);
  addDefaultDependency('@sbb-esta/angular-icons', sbbAngularVersionRange, tree, context);
  addDefaultDependency(
    '@angular/cdk',
    require('../../package.json').peerDependencies['@angular/cdk'],
    tree,
    context
  );
  addDefaultDependency(
    '@angular/animations',
    getPackageJsonDependency(tree, '@angular/core')!.version,
    tree,
    context
  );

  return tree;
};
