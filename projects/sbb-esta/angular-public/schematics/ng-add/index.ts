import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';
import { validateProjectName } from '@schematics/angular/utility/validation';

import {
  addDefaultDependency,
  getPackageVersionFromPackageJson,
  readJsonFile
} from '../package-config';

import { Schema } from './schema';

export const TYPOGRAPHY_CSS_PATH = 'node_modules/@sbb-esta/angular-public/typography.css';

export function ngAdd(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    assertBusinessNotInstalled(host);

    const name = extractAndValidateProjectName(options, host);

    addDependencies(host, context);
    addTypographyToAngularJson(host, name, context);

    return host;
  };
}

const assertBusinessNotInstalled = (tree: Tree) => {
  if (getPackageJsonDependency(tree, '@sbb-esta/angular-business')) {
    throw new SchematicsException(
      '@sbb-esta/angular-business is already installed, please add @sbb-esta/angular-public dependency manually if you like to proceed.'
    );
  }
};

const extractAndValidateProjectName = (options: Schema, tree: Tree): string => {
  const name = options.name || getWorkspace(tree).defaultProject;
  if (!name) {
    throw new SchematicsException('Please specify a project using "--name project-name"');
  }
  validateProjectName(name);
  return name;
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

  context.addTask(new NodePackageInstallTask());
  return tree;
};

const addTypographyToAngularJson = (
  tree: Tree,
  projectName: string,
  context: SchematicContext
): Tree => {
  const angularJsonPath = 'angular.json';
  const angularJson = readJsonFile(tree, angularJsonPath);

  if (
    angularJson.projects[projectName].architect.build.options.styles.includes(TYPOGRAPHY_CSS_PATH)
  ) {
    context.logger.info('Typography is already set up');
    return tree;
  }

  angularJson.projects[projectName].architect.build.options.styles.push(TYPOGRAPHY_CSS_PATH);
  angularJson.projects[projectName].architect.test.options.styles.push(TYPOGRAPHY_CSS_PATH);
  tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

  context.logger.info(`✅️ Added typography css entry to ${angularJsonPath}`);

  return tree;
};
