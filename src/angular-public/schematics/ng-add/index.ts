import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import { addPackageToPackageJson, getPackageVersionFromPackageJson } from './package-config';
import { Schema } from './schema';

/**
 * Version range that will be used for sbb-angular and the Angular CDK if this
 * schematic has been run outside of the CLI `ng add` command. In those cases, there
 * can be no dependency on `@sbb-esta/angular-public` in the `package.json` file, and we need
 * to manually insert the dependency based on the build version placeholder.
 *
 * Note that the fallback version range does not use caret, but tilde because that is
 * the default for Angular framework dependencies in CLI projects.
 */
const fallbackSbbAngularVersionRange = `~0.0.0-PLACEHOLDER`;
const fallbackCdkVersionRange = `~0.0.0-CDK`;

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @angular/material`.
 *
 * Since the Angular Material schematics depend on the schematic utility functions from the CDK,
 * we need to install the CDK before loading the schematic files that import from the CDK.
 */
export default function (options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (getPackageJsonDependency(host, '@sbb-esta/angular-public')) {
      context.logger.info(
        '@sbb-esta/angular-public is already installed, please set up @sbb-esta/angular-public manually'
      );
      return;
    }

    // Version tag of the `@angular/core` dependency that has been loaded from the `package.json`
    // of the CLI project. This tag should be preferred because all Angular dependencies should
    // have the same version tag if possible.
    const ngCoreVersionTag = getPackageVersionFromPackageJson(host, '@angular/core');
    const cdkVersionTag = getPackageVersionFromPackageJson(host, '@angular/cdk');
    const sbbAngularVersionRange = getPackageVersionFromPackageJson(
      host,
      '@sbb-esta/angular-public'
    );
    const angularDependencyVersion = ngCoreVersionTag || `0.0.0-NG`;

    // The CLI inserts `@sbb-esta/angular-public` into the `package.json` before this schematic runs.
    // This means that we do not need to insert @sbb-esta/angular-public into `package.json` files again.
    // In some cases though, it could happen that this schematic runs outside of the CLI `ng add`
    // command, or @sbb-esta/angular-public is only listed a dev dependency. If that is the case, we insert a
    // version based on the current build version (substituted version placeholder).
    if (sbbAngularVersionRange === null) {
      addPackageToPackageJson(host, '@sbb-esta/angular-public', fallbackSbbAngularVersionRange);
    }

    if (cdkVersionTag === null) {
      addPackageToPackageJson(host, '@angular/cdk', fallbackCdkVersionRange);
    }

    addPackageToPackageJson(host, '@angular/forms', angularDependencyVersion);
    addPackageToPackageJson(host, '@angular/animations', angularDependencyVersion);
    addPackageToPackageJson(
      host,
      '@sbb-esta/angular-core',
      sbbAngularVersionRange || fallbackSbbAngularVersionRange
    );

    // Since the Angular SBB schematics depend on the schematic utility functions from the
    // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
    const installTaskId = context.addTask(new NodePackageInstallTask());
    const setupTaskId = context.addTask(new RunSchematicTask('ng-add-setup-project', options), [
      installTaskId,
    ]);
    context.addTask(new RunSchematicTask('@sbb-esta/angular-core', 'ng-add', options), [
      setupTaskId,
    ]);
  };
}
