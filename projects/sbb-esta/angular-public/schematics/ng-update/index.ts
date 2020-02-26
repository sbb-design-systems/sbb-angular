import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson, getPackageVersionFromPackageJson } from './package-config';

export function updateToV9(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const sbbAngularVersionRange =
      getPackageVersionFromPackageJson(host, '@sbb-esta/angular-public') ||
      require('../../package.json').version;
    addPackageToPackageJson(host, '@sbb-esta/angular-core', sbbAngularVersionRange);
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}
