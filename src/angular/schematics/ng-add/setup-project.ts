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
  getProjectFromWorkspace,
  getProjectMainFile,
  getProjectTargetOptions,
  hasNgModuleImport,
} from '@angular/cdk/schematics';
import {
  addModuleImportToStandaloneBootstrap,
  importsProvidersFrom,
} from '@schematics/angular/private/components';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { getProjectName } from '../utils';

import { Schema } from './schema';

export const TYPOGRAPHY_CSS_PATH = 'node_modules/@sbb-esta/angular/typography.css';

export const LEAN_TEST_POLYFILL_PATH = '@sbb-esta/angular/core/testing/lean-polyfill';

/** Name of the Angular module that enables Angular browser animations. */
export const BROWSER_ANIMATIONS_MODULE_NAME = 'BrowserAnimationsModule';

/** Name of the module that switches Angular animations to a noop implementation. */
export const NOOP_ANIMATIONS_MODULE_NAME = 'NoopAnimationsModule';

// noinspection JSUnusedGlobalSymbols
export default function (options: Schema): Rule {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, getProjectName(options, workspace));

    if (project.extensions.projectType === ProjectType.Application) {
      return chain([addAnimationsModule(options), addAndConfigureTypography(options)]);
    }
    context.logger.warn(
      '@sbb-esta/angular has been set up in your workspace. There is no additional setup ' +
        'required for consuming @sbb-esta/angular in your library project.\n\n' +
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
    const project = getProjectFromWorkspace(workspace, getProjectName(options, workspace));

    try {
      addAnimationsModuleToNonStandaloneApp(host, project, context, options);
    } catch (e) {
      if ((e as { message?: string }).message?.includes('Bootstrap call not found')) {
        addAnimationsModuleToStandaloneApp(host, project, context, options);
      } else {
        throw e;
      }
    }
  };
}

/** Adds the animations module to an app that is bootstrapped using the standalone component APIs. */
function addAnimationsModuleToStandaloneApp(
  host: Tree,
  project: ProjectDefinition,
  context: SchematicContext,
  options: Schema
) {
  const mainFile = getProjectMainFile(project);

  if (options.animations === 'enabled') {
    // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
    // message that makes the user aware of the fact that we won't automatically set up
    // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
    // is already configured, we would cause unexpected behavior and runtime exceptions.
    if (importsProvidersFrom(host, mainFile, NOOP_ANIMATIONS_MODULE_NAME)) {
      context.logger.error(
        `Could not set up "${BROWSER_ANIMATIONS_MODULE_NAME}" ` +
          `because "${NOOP_ANIMATIONS_MODULE_NAME}" is already imported.`
      );
      context.logger.info(`Please manually set up browser animations.`);
    } else {
      addModuleImportToStandaloneBootstrap(
        host,
        mainFile,
        BROWSER_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations'
      );
    }
  } else if (
    options.animations === 'disabled' &&
    !importsProvidersFrom(host, mainFile, BROWSER_ANIMATIONS_MODULE_NAME)
  ) {
    // Do not add the NoopAnimationsModule module if the project already explicitly uses
    // the BrowserAnimationsModule.
    addModuleImportToStandaloneBootstrap(
      host,
      mainFile,
      NOOP_ANIMATIONS_MODULE_NAME,
      '@angular/platform-browser/animations'
    );
  }
}

/**
 * Adds the animations module to an app that is bootstrap
 * using the non-standalone component APIs.
 */
function addAnimationsModuleToNonStandaloneApp(
  host: Tree,
  project: ProjectDefinition,
  context: SchematicContext,
  options: Schema
) {
  const appModulePath = getAppModulePath(host, getProjectMainFile(project));

  if (options.animations === 'enabled') {
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
    } else {
      addModuleImportToRootModule(
        host,
        BROWSER_ANIMATIONS_MODULE_NAME,
        '@angular/platform-browser/animations',
        project
      );
    }
  } else if (
    options.animations === 'disabled' &&
    !hasNgModuleImport(host, appModulePath, BROWSER_ANIMATIONS_MODULE_NAME)
  ) {
    // Do not add the NoopAnimationsModule module if the project already explicitly uses
    // the BrowserAnimationsModule.
    addModuleImportToRootModule(
      host,
      NOOP_ANIMATIONS_MODULE_NAME,
      '@angular/platform-browser/animations',
      project
    );
  }
}

function addAndConfigureTypography(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const shouldBeLeanVariant = options.variant === 'lean (previously known as business)';

    return chain([
      addTypographyToStylesNodeOfAngularJson(
        getProjectName(options, workspace),
        'build',
        context.logger
      ),
      addTypographyToStylesNodeOfAngularJson(
        getProjectName(options, workspace),
        'test',
        context.logger
      ),
      setTypographyVariant(options),

      addLeanTestPolyfillToAngularJson(
        getProjectName(options, workspace),
        shouldBeLeanVariant,
        context.logger
      ),
    ]);
  };
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
    const styles = targetOptions.styles as (string | { input: string })[] | undefined;

    if (!styles) {
      targetOptions.styles = [TYPOGRAPHY_CSS_PATH];
      return;
    }

    const hasAlreadyTypographyAdded = styles
      .map((s) => (typeof s === 'string' ? s : s.input))
      .some((style) => style === TYPOGRAPHY_CSS_PATH);

    if (hasAlreadyTypographyAdded) {
      return;
    }

    styles.unshift(TYPOGRAPHY_CSS_PATH);
  });
}

function addLeanTestPolyfillToAngularJson(
  projectName: string,
  shouldBeLeanVariant: boolean,
  logger: logging.LoggerApi
): Rule {
  return updateWorkspace((workspace) => {
    const project = getProjectFromWorkspace(workspace, projectName);
    const targetName = 'test';

    // Do not update the builder options in case the target does not use the default CLI builder.
    if (!validateDefaultTargetBuilder(project, targetName, logger)) {
      return;
    }

    const targetOptions = getProjectTargetOptions(project, targetName);
    const polyfills = targetOptions.polyfills as string | string[] | undefined;

    if (polyfills && typeof polyfills !== 'string' && !Array.isArray(polyfills)) {
      logger.error(
        `Could not configure testing environment.` +
          `The 'polyfills' section in 'angular.json' has an unknown format.`
      );
      return;
    }

    if (shouldBeLeanVariant) {
      if (!polyfills) {
        targetOptions.polyfills = [LEAN_TEST_POLYFILL_PATH];
        return;
      }

      if (typeof polyfills === 'string' && targetOptions.polyfills !== LEAN_TEST_POLYFILL_PATH) {
        targetOptions.polyfills = [polyfills, LEAN_TEST_POLYFILL_PATH];
      } else if (Array.isArray(polyfills) && !polyfills.includes(LEAN_TEST_POLYFILL_PATH)) {
        polyfills.push(LEAN_TEST_POLYFILL_PATH);
      }
    } else {
      if (!polyfills) {
        return;
      }

      if (typeof polyfills === 'string' && polyfills === LEAN_TEST_POLYFILL_PATH) {
        delete targetOptions.polyfills;
      } else if (Array.isArray(polyfills)) {
        targetOptions.polyfills = polyfills.filter(
          (polyfill) => polyfill !== LEAN_TEST_POLYFILL_PATH
        );
      }
    }

    logger.info(
      `✔️ Configured testing environment with ${
        shouldBeLeanVariant ? 'lean' : 'standard'
      } design variant.`
    );
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
  // with SBB Angular. See: https://github.com/angular/components/issues/14176
  if (!isDefaultBuilder && targetName === 'build') {
    throw new SchematicsException(
      `Your project is not using the default builders for ` +
        `"${targetName}". The SBB Angular schematics cannot add a theme to the workspace ` +
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

function setTypographyVariant(options: Schema) {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, getProjectName(options, workspace));
    const shouldBeLeanVariant = options.variant === 'lean (previously known as business)';

    handleIndexHtml(tree, project, shouldBeLeanVariant, context);
  };
}

function handleIndexHtml(
  tree: Tree,
  project: ProjectDefinition,
  shouldBeLeanVariant: boolean,
  context: SchematicContext
) {
  // Do not update the builder options in case the target does not use the default CLI builder.
  if (!validateDefaultTargetBuilder(project, 'build', context.logger)) {
    return;
  }

  const targetOptions = getProjectTargetOptions(project, 'build');

  if (!targetOptions?.index) {
    if (shouldBeLeanVariant) {
      context.logger.error(
        `Could not find index.html to configure design variant. If you like to use the lean design variant, please add 'sbb-lean' class to the <html> tag.`
      );
    } else {
      context.logger.error(
        `Could not find index.html to configure design variant. Please check your <html> tag if the design variant is correctly configured.`
      );
    }
    return;
  }

  const indexHtml = tree.read(targetOptions.index as string)?.toString('utf-8');

  if (!indexHtml) {
    if (shouldBeLeanVariant) {
      context.logger.error(
        `Could not read index.html to configure design variant. If you like to use the lean design variant, please add 'sbb-lean' class to the <html> tag.`
      );
    } else {
      context.logger.error(
        `Could not read index.html to configure design variant. Please check your <html> tag if the design variant is correctly configured.`
      );
    }
    return;
  }

  const htmlTag = indexHtml.match(
    /<html(?=\s)(?!(?:[^>"\']|"[^"]*"|\'[^\']*\')*?(?<=\s)(?:term|range)\s*=)(?!\s*\/?>)\s+(?:".*?"|\'.*?\'|[^>]*?)+>/g
  )?.[0];

  if (!htmlTag) {
    context.logger.error(
      `Could not find <html> tag. Please check your <html> tag if the design variant is correctly configured.`
    );
    return;
  }

  const classTag = htmlTag.match(/class=(["'])?((?:.(?!\1|>))*.?)\1?/g)?.[0];
  const classList = classTag?.replace(/["']/g, '').replace('class=', '').split(' ');
  const hasSbbLeanClass = classList?.includes('sbb-lean');

  if (hasSbbLeanClass && !shouldBeLeanVariant) {
    // Remove sbb-lean class
    const onlyLeanClassInClassList = classList!.length === 1;
    const htmlTagWithoutLeanClass = onlyLeanClassInClassList
      ? htmlTag.replace(` ${classTag!}`, '')
      : htmlTag.replace(' sbb-lean', '').replace('sbb-lean ', '');

    tree.overwrite(
      targetOptions.index as string,
      indexHtml.replace(htmlTag, htmlTagWithoutLeanClass)
    );
  } else if (!hasSbbLeanClass && shouldBeLeanVariant) {
    // Add sbb-lean class
    const newIndexHtml = classTag
      ? indexHtml.replace(classTag, classTag.replace(/(?<=^.{7})/, 'sbb-lean '))
      : indexHtml.replace('<html', '<html class="sbb-lean"');
    tree.overwrite(targetOptions.index as string, newIndexHtml);
  }

  context.logger.info(
    `✔️ Configured typography with ${hasSbbLeanClass ? 'lean' : 'standard'} design variant.`
  );
}
