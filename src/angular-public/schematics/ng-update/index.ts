import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addDefaultDependency, getPackageVersionFromPackageJson } from '../utils';

export function updateToV9(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const sbbAngularVersionRange =
      getPackageVersionFromPackageJson(host, '@sbb-esta/angular-public') || `~0.0.0-PLACEHOLDER`;
    addDefaultDependency('@sbb-esta/angular-core', sbbAngularVersionRange, host, context);
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}
