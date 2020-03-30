import { parseJsonAst } from '@angular-devkit/core';
import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import {
  addModuleImportToRootModule,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
  hasNgModuleImport
} from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  appendPropertyInAstObject,
  appendValueInAstArray,
  findPropertyInAstObject
} from '@schematics/angular/utility/json-utils';
import { validateProjectName } from '@schematics/angular/utility/validation';

import { findPropertyInDeepAstObject } from '../utils';

import { Schema } from './schema';

export const TYPOGRAPHY_CSS_PATH = 'node_modules/@sbb-esta/angular-public/typography.css';

/** Name of the Angular module that enables Angular browser animations. */
export const BROWSER_ANIMATIONS_MODULE_NAME = 'BrowserAnimationsModule';

/** Name of the module that switches Angular animations to a noop implementation. */
export const NOOP_ANIMATIONS_MODULE_NAME = 'NoopAnimationsModule';

export default function(options: Schema): Rule {
  return chain([addAnimationsModule(options), addTypographyToAngularJson(options)]);
}

function addTypographyToAngularJson(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const angularJsonPath = 'angular.json';
    const projectName = extractAndValidateProjectName(options, host);

    addTypographyToStylesNode('build', projectName, angularJsonPath, host, context);
    addTypographyToStylesNode('test', projectName, angularJsonPath, host, context);

    return host;
  };
}

function extractAndValidateProjectName(options: Schema, tree: Tree): string {
  const name = options.name || getWorkspace(tree).defaultProject;
  if (!name) {
    throw new SchematicsException('Please specify a project using "--name project-name"');
  }
  validateProjectName(name);
  return name;
}

function addTypographyToStylesNode(
  buildOrTest: 'build' | 'test',
  projectName: string,
  angularJsonPath: string,
  tree: Tree,
  context: SchematicContext
): Tree {
  const angularConfigContent = tree.read(angularJsonPath);
  if (!angularConfigContent) {
    throw new SchematicsException(`Invalid path: ${angularJsonPath}.`);
  }

  const angularJsonAst = parseJsonAst(angularConfigContent.toString('utf-8'));
  if (angularJsonAst.kind !== 'object') {
    throw new SchematicsException(`Invalid ${angularJsonPath} content.`);
  }

  const optionsAstNode = findPropertyInDeepAstObject(angularJsonAst, [
    'projects',
    projectName,
    'architect',
    buildOrTest,
    'options'
  ]);

  if (!optionsAstNode) {
    throw new SchematicsException(`Invalid ${angularJsonPath} content.`);
  }

  const stylesAstNode = findPropertyInAstObject(optionsAstNode, 'styles');

  if (!stylesAstNode) {
    const recorderAddStylesProperty = tree.beginUpdate(angularJsonPath);
    appendPropertyInAstObject(
      recorderAddStylesProperty,
      optionsAstNode,
      'styles',
      [TYPOGRAPHY_CSS_PATH],
      12
    );
    tree.commitUpdate(recorderAddStylesProperty);
    return tree;
  }

  if (stylesAstNode.kind !== 'array') {
    throw new SchematicsException(`Invalid ${angularJsonPath} content.`);
  }

  if (stylesAstNode.value.includes(TYPOGRAPHY_CSS_PATH)) {
    context.logger.info(`Typography is already set up (${buildOrTest})`);
    return tree;
  }

  const recorder = tree.beginUpdate(angularJsonPath);
  appendValueInAstArray(recorder, stylesAstNode, TYPOGRAPHY_CSS_PATH, 14);
  tree.commitUpdate(recorder);

  context.logger.info(`✅️ Added typography css entry to ${angularJsonPath} (${buildOrTest})`);

  return tree;
}

/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Sbb Angular will throw an exception.
 */
function addAnimationsModule(options: Schema) {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.name);
    const appModulePath = getAppModulePath(host, getProjectMainFile(project));

    if (options.animations) {
      // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
      // message that makes the user aware of the fact that we won't automatically set up
      // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
      // is already configured, we would cause unexpected behavior and runtime exceptions.
      if (hasNgModuleImport(host, appModulePath, NOOP_ANIMATIONS_MODULE_NAME)) {
        context.logger.error(
          `Could not set up "${BROWSER_ANIMATIONS_MODULE_NAME}" ` +
            `because "${NOOP_ANIMATIONS_MODULE_NAME}" is already imported.`
        );
        context.logger.info(`Please manually set up browser animations.`);
        return;
      }

      addModuleImportToRootModule(
        host,
        BROWSER_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations',
        project
      );

      context.logger.info(`✅️ Added ${BROWSER_ANIMATIONS_MODULE_NAME} to angular.json`);
    } else if (!hasNgModuleImport(host, appModulePath, BROWSER_ANIMATIONS_MODULE_NAME)) {
      // Do not add the NoopAnimationsModule module if the project already explicitly uses
      // the BrowserAnimationsModule.
      addModuleImportToRootModule(
        host,
        NOOP_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations',
        project
      );
      context.logger.info(`✅️ Added ${NOOP_ANIMATIONS_MODULE_NAME} to angular.json`);
    }

    return host;
  };
}
