import { logging } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  chain,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import {
  addModuleImportToRootModule,
  defaultTargetBuilders,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
  getProjectTargetOptions,
  hasNgModuleImport,
} from '@angular/cdk/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { Schema } from './schema';

export const TYPOGRAPHY_CSS_PATH = 'node_modules/@sbb-esta/angular-public/typography.css';
export const BUSINESS_TYPOGRAPHY_CSS_PATH =
  'node_modules/@sbb-esta/angular-business/typography.css';

/** Name of the Angular module that enables Angular browser animations. */
export const BROWSER_ANIMATIONS_MODULE_NAME = 'BrowserAnimationsModule';

/** Name of the module that switches Angular animations to a noop implementation. */
export const NOOP_ANIMATIONS_MODULE_NAME = 'NoopAnimationsModule';

// noinspection JSUnusedGlobalSymbols
export default function (options: Schema): Rule {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);

    if (project.extensions.projectType === ProjectType.Application) {
      return chain([
        addAnimationsModule(options),
        addTypographyToAngularJson(options, context.logger),
      ]);
    }
    context.logger.warn(
      '@sbb-esta/angular-public has been set up in your workspace. There is no additional setup ' +
        'required for consuming @sbb-esta/angular-public in your library project.\n\n' +
        'If you intended to run the schematic on a different project, pass the `--project` ' +
        'option.'
    );
    return noop();
  };
}

/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Sbb Angular will throw an exception.
 */
function addAnimationsModule(options: Schema) {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
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

      context.logger.info(`✔️ Added ${BROWSER_ANIMATIONS_MODULE_NAME} to ${appModulePath}`);
    } else if (!hasNgModuleImport(host, appModulePath, BROWSER_ANIMATIONS_MODULE_NAME)) {
      // Do not add the NoopAnimationsModule module if the project already explicitly uses
      // the BrowserAnimationsModule.
      addModuleImportToRootModule(
        host,
        NOOP_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations',
        project
      );
    }
  };
}

function addTypographyToAngularJson(options: Schema, logger: logging.LoggerApi): Rule {
  return chain([
    addTypographyToStylesNodeOfAngularJson(options.project, 'build', logger),
    addTypographyToStylesNodeOfAngularJson(options.project, 'test', logger),
  ]);
}

function addTypographyToStylesNodeOfAngularJson(
  projectName: string,
  targetName: 'build' | 'test',
  logger: logging.LoggerApi
): Rule {
  return updateWorkspace((workspace) => {
    const project = getProjectFromWorkspace(workspace, projectName);

    // Do not update the builder options in case the target does not use the default CLI builder.
    if (!validateDefaultTargetBuilder(project, targetName, logger)) {
      return;
    }

    const targetOptions = getProjectTargetOptions(project, targetName);
    const styles = targetOptions.styles as (string | { input: string })[];

    if (!styles) {
      targetOptions.styles = [TYPOGRAPHY_CSS_PATH];
    } else {
      const existingStyles = styles.map((s) => (typeof s === 'string' ? s : s.input));

      for (const stylePath of existingStyles) {
        // If the given asset is already specified in the styles, we don't need to do anything.
        if (stylePath === TYPOGRAPHY_CSS_PATH) {
          return;
        }

        // In case the public typography is already added, we skip adding the public typography.
        if (stylePath.includes(BUSINESS_TYPOGRAPHY_CSS_PATH)) {
          logger.error(
            `Could not add the typography to the CLI project ` +
              `configuration because there is already a sbb typographyfile referenced.`
          );
          return;
        }
      }

      styles.unshift(TYPOGRAPHY_CSS_PATH);
    }
  });
}

/**
 * Validates that the specified project target is configured with the default builders which are
 * provided by the Angular CLI. If the configured builder does not match the default builder,
 * this function can either throw or just show a warning.
 */
function validateDefaultTargetBuilder(
  project: ProjectDefinition,
  targetName: 'build' | 'test',
  logger: logging.LoggerApi
) {
  const defaultBuilder = defaultTargetBuilders[targetName];
  const targetConfig = project.targets && project.targets.get(targetName);
  const isDefaultBuilder = targetConfig && targetConfig['builder'] === defaultBuilder;

  // Because the build setup for the Angular CLI can be customized by developers, we can't know
  // where to put the theme file in the workspace configuration if custom builders are being
  // used. In case the builder has been changed for the "build" target, we throw an error and
  // exit because setting up a theme is a primary goal of `ng-add`. Otherwise if just the "test"
  // builder has been changed, we warn because a theme is not mandatory for running tests
  // with Material. See: https://github.com/angular/components/issues/14176
  if (!isDefaultBuilder && targetName === 'build') {
    throw new SchematicsException(
      `Your project is not using the default builders for ` +
        `"${targetName}". The Angular Material schematics cannot add a theme to the workspace ` +
        `configuration if the builder has been changed.`
    );
  } else if (!isDefaultBuilder) {
    // for non-build targets we gracefully report the error without actually aborting the
    // setup schematic. This is because a theme is not mandatory for running tests.
    logger.warn(
      `Your project is not using the default builders for "${targetName}". This ` +
        `means that we cannot add the configured theme to the "${targetName}" target.`
    );
  }

  return isDefaultBuilder;
}
