import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  addModuleImportToRootModule,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
  hasNgModuleImport,
} from '@angular/cdk/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/config';

import { Schema } from './schema';

export const TYPOGRAPHY_CSS_PATH = 'node_modules/@sbb-esta/angular-public/typography.css';

/** Name of the Angular module that enables Angular browser animations. */
export const BROWSER_ANIMATIONS_MODULE_NAME = 'BrowserAnimationsModule';

/** Name of the module that switches Angular animations to a noop implementation. */
export const NOOP_ANIMATIONS_MODULE_NAME = 'NoopAnimationsModule';

// noinspection JSUnusedGlobalSymbols
export function setUp(options: Schema): Rule {
  return chain([addAnimationsModule(options), addTypographyToAngularJson(options)]);
}

function addTypographyToAngularJson(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    addTypographyToStylesNodeOfAngularJson('build', options, host, context);
    addTypographyToStylesNodeOfAngularJson('test', options, host, context);
    return host;
  };
}

function addTypographyToStylesNodeOfAngularJson(
  buildOrTest: 'build' | 'test',
  options: Schema,
  tree: Tree,
  context: SchematicContext
): Tree {
  const workspace = getWorkspace(tree);
  const projectName = options.name || workspace.defaultProject;

  if (!projectName || !workspace?.projects?.[projectName]?.architect?.[buildOrTest]?.options) {
    context.logger.error(
      `Unable to add the typography. Please add an import to ${TYPOGRAPHY_CSS_PATH} to your project.`
    );
    return tree;
  }

  const optionsNode = workspace.projects[projectName].architect![buildOrTest]!.options! as any;

  if (!optionsNode.styles) {
    optionsNode.styles = [TYPOGRAPHY_CSS_PATH];

    updateWorkspace(workspace)(tree, context);
    context.logger.info(`✔️ Added typography css entry to angular.json (${buildOrTest})`);
    return tree;
  }

  if (optionsNode.styles.includes(TYPOGRAPHY_CSS_PATH)) {
    context.logger.info(`Typography is already set up (${buildOrTest})`);
    return tree;
  }

  optionsNode.styles.push(TYPOGRAPHY_CSS_PATH);

  updateWorkspace(workspace)(tree, context);

  context.logger.info(`✔️ Added typography css entry to angular.json (${buildOrTest})`);

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
          `Could not set up "${BROWSER_ANIMATIONS_MODULE_NAME}" because "${NOOP_ANIMATIONS_MODULE_NAME}" is already imported. Please manually set up browser animations.`
        );
        return;
      }

      addModuleImportToRootModule(
        host,
        BROWSER_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations',
        project
      );

      context.logger.info(`✔️ Added ${BROWSER_ANIMATIONS_MODULE_NAME} to angular.json`);
    } else {
      if (hasNgModuleImport(host, appModulePath, BROWSER_ANIMATIONS_MODULE_NAME)) {
        // Do not add the NoopAnimationsModule module if the project already explicitly uses
        // the BrowserAnimationsModule.
        context.logger.error(
          `Could not set up "${NOOP_ANIMATIONS_MODULE_NAME}" because "${BROWSER_ANIMATIONS_MODULE_NAME}" is already imported. Please manually set up browser animations.`
        );
        return;
      }

      addModuleImportToRootModule(
        host,
        NOOP_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations',
        project
      );
      context.logger.info(`✔️ Added ${NOOP_ANIMATIONS_MODULE_NAME} to angular.json`);
    }

    return host;
  };
}
