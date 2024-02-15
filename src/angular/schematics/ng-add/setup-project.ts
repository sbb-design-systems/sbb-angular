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
  getProjectBuildTargets,
  getProjectFromWorkspace,
  getProjectTargetOptions,
  getProjectTestTargets,
} from '@angular/cdk/schematics';
import { addRootProvider } from '@schematics/angular/utility';
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
    const project = getProjectFromWorkspace(workspace, options.project);

    if (project.extensions.projectType === ProjectType.Application) {
      return chain([
        options.animations === 'excluded'
          ? noop()
          : addRootProvider(options.project, ({ code, external }) => {
              return code`${external(
                'provideAnimationsAsync',
                '@angular/platform-browser/animations/async',
              )}(${options.animations === 'disabled' ? `'noop'` : ''})`;
            }),
        addAndConfigureTypography(options),
      ]);
    }
    context.logger.warn(
      '@sbb-esta/angular has been set up in your workspace. There is no additional setup ' +
        'required for consuming @sbb-esta/angular in your library project.\n\n' +
        'If you intended to run the schematic on a different project, pass the `--project` ' +
        'option.',
    );
    return;
  };
}

function addAndConfigureTypography(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const shouldBeLeanVariant = options.variant === 'lean (previously known as business)';

    return chain([
      addTypographyToStylesNodeOfAngularJson(
        getProjectName(options, workspace),
        'build',
        context.logger,
      ),
      addTypographyToStylesNodeOfAngularJson(
        getProjectName(options, workspace),
        'test',
        context.logger,
      ),
      setTypographyVariant(options),

      addLeanTestPolyfillToAngularJson(
        getProjectName(options, workspace),
        shouldBeLeanVariant,
        context.logger,
      ),
    ]);
  };
}

function addTypographyToStylesNodeOfAngularJson(
  projectName: string,
  targetName: 'build' | 'test',
  logger: logging.LoggerApi,
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
  logger: logging.LoggerApi,
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
          `The 'polyfills' section in 'angular.json' has an unknown format.`,
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
          (polyfill) => polyfill !== LEAN_TEST_POLYFILL_PATH,
        );
      }
    }

    logger.info(
      `✔️ Configured testing environment with ${
        shouldBeLeanVariant ? 'lean' : 'standard'
      } design variant.`,
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
  logger: logging.LoggerApi,
) {
  const targets =
    targetName === 'test' ? getProjectTestTargets(project) : getProjectBuildTargets(project);
  const isDefaultBuilder = targets.length > 0;

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
        `configuration if the builder has been changed.`,
    );
  } else if (!isDefaultBuilder) {
    // for non-build targets we gracefully report the error without actually aborting the
    // setup schematic. This is because a theme is not mandatory for running tests.
    logger.warn(
      `Your project is not using the default builders for "${targetName}". This ` +
        `means that we cannot add the configured theme to the "${targetName}" target.`,
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
  context: SchematicContext,
) {
  // Do not update the builder options in case the target does not use the default CLI builder.
  if (!validateDefaultTargetBuilder(project, 'build', context.logger)) {
    return;
  }

  const targetOptions = getProjectTargetOptions(project, 'build');

  if (!targetOptions?.index) {
    if (shouldBeLeanVariant) {
      context.logger.error(
        `Could not find index.html to configure design variant. If you like to use the lean design variant, please add 'sbb-lean' class to the <html> tag.`,
      );
    } else {
      context.logger.error(
        `Could not find index.html to configure design variant. Please check your <html> tag if the design variant is correctly configured.`,
      );
    }
    return;
  }

  const indexHtml = tree.read(targetOptions.index as string)?.toString('utf-8');

  if (!indexHtml) {
    if (shouldBeLeanVariant) {
      context.logger.error(
        `Could not read index.html to configure design variant. If you like to use the lean design variant, please add 'sbb-lean' class to the <html> tag.`,
      );
    } else {
      context.logger.error(
        `Could not read index.html to configure design variant. Please check your <html> tag if the design variant is correctly configured.`,
      );
    }
    return;
  }

  const htmlTag = indexHtml.match(
    /<html(?=\s)(?!(?:[^>"\']|"[^"]*"|\'[^\']*\')*?(?<=\s)(?:term|range)\s*=)(?!\s*\/?>)\s+(?:".*?"|\'.*?\'|[^>]*?)+>/g,
  )?.[0];

  if (!htmlTag) {
    context.logger.error(
      `Could not find <html> tag. Please check your <html> tag if the design variant is correctly configured.`,
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
      indexHtml.replace(htmlTag, htmlTagWithoutLeanClass),
    );
  } else if (!hasSbbLeanClass && shouldBeLeanVariant) {
    // Add sbb-lean class
    const newIndexHtml = classTag
      ? indexHtml.replace(classTag, classTag.replace(/(?<=^.{7})/, 'sbb-lean '))
      : indexHtml.replace('<html', '<html class="sbb-lean"');
    tree.overwrite(targetOptions.index as string, newIndexHtml);
  }

  context.logger.info(
    `✔️ Configured typography with ${hasSbbLeanClass ? 'lean' : 'standard'} design variant.`,
  );
}
