import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson, getPackageVersionFromPackageJson } from './package-config';
import { Schema } from './schema';

/**
 * Version range that will be used for sbb-angular and the Angular CDK if this
 * schematic has been run outside of the CLI `ng add` command. In those cases, there
 * can be no dependency on `@sbb-esta/angular` in the `package.json` file, and we need
 * to manually insert the dependency based on the build version placeholder.
 *
 * Note that the fallback version range does not use caret, but tilde because that is
 * the default for Angular framework dependencies in CLI projects.
 */
const fallbackSbbAngularVersionRange = `~0.0.0-PLACEHOLDER`;
const fallbackCdkVersionRange = `0.0.0-CDK`.replace('-0', '');

export function ngAdd(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    function getMajorVersion(version?: string | null) {
      return parseInt(version?.match(/\d+/g)?.[0] ?? '0', 10);
    }

    // Version tag of the `@angular/core` dependency that has been loaded from the `package.json`
    // of the CLI project. This tag should be preferred because all Angular dependencies should
    // have the same version tag if possible.
    const ngCoreVersionTag = getPackageVersionFromPackageJson(host, '@angular/core');
    const cdkVersionTag = getPackageVersionFromPackageJson(host, '@angular/cdk');
    const sbbAngularVersionRange = getPackageVersionFromPackageJson(host, '@sbb-esta/angular');
    const angularDependencyVersion = ngCoreVersionTag || `0.0.0-NG`;

    if (
      getMajorVersion(ngCoreVersionTag) < 14 ||
      (cdkVersionTag != null && getMajorVersion(cdkVersionTag) < 14)
    ) {
      context.logger.error(
        `Please update Angular dependencies first (See https://update.angular.io/?l=3&v=13.0-14.0): `
      );
      context.logger.error('');
      context.logger.error(`  ng update @angular/core@14 @angular/cli@14 @angular/cdk@14 --force`);
      context.logger.error('');
      context.logger.error(`'--force' is required due to peer dependencies conflicts.`);
      return;
    }

    // The CLI inserts `@sbb-esta/angular` into the `package.json` before this schematic runs.
    // This means that we do not need to insert @sbb-esta/angular into `package.json` files again.
    // In some cases though, it could happen that this schematic runs outside of the CLI `ng add`
    // command, or @sbb-esta/angular is only listed a dev dependency. If that is the case, we insert a
    // version based on the current build version (substituted version placeholder).
    if (sbbAngularVersionRange === null) {
      addPackageToPackageJson(host, '@sbb-esta/angular', fallbackSbbAngularVersionRange);
    }

    if (cdkVersionTag === null) {
      addPackageToPackageJson(host, '@angular/cdk', fallbackCdkVersionRange);
    }

    // Forms and animations are added by default `ng new` command.
    // However, to guarantee the dependencies are included, we add them here too
    addPackageToPackageJson(host, '@angular/forms', angularDependencyVersion);
    addPackageToPackageJson(host, '@angular/animations', angularDependencyVersion);

    // Since the Angular SBB schematics depend on the schematic utility functions from the
    // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
    const installTaskId = context.addTask(new NodePackageInstallTask());
    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);

    // If there are existing imports to @sbb-esta/angular-public, @sbb-esta/angular-business, @sbb-esta/angular-core log a warning
    const legacyVersions = [
      '@sbb-esta/angular-business',
      '@sbb-esta/angular-public',
      '@sbb-esta/angular-core',
    ].filter((packageName) => !!getPackageVersionFromPackageJson(host, packageName));

    if (legacyVersions.length) {
      context.logger.warn(
        `Your repository includes the deprecated packages ${legacyVersions.join(
          ', '
        )}. If you like to automatically migrate from the legacy packages to @sbb-esta/angular, please add version 13 first and see our how-to-update guide.`
      );
    }
  };
}
