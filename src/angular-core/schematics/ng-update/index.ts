import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  cdkMigrations,
  createMigrationSchematicRule,
  getProjectFromWorkspace,
  getProjectTargetOptions,
  TargetVersion,
} from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';

import { addIconCdnProvider } from '../ng-add';

import { ClassNamesMigration } from './migrations/class-names';
import { IconMigration } from './migrations/icon-migration';
import { sbbAngularUpgradeData } from './upgrade-data';

/** Entry point for the migration schematics with target of sbb-angular 10.0.0 */
export function updateToV10(): Rule {
  return createMigrationSchematicRule(
    TargetVersion.V10,
    [],
    sbbAngularUpgradeData,
    onMigrationComplete
  );
}

/** Entry point for adding the icon cdn registry to the app module. */
export function addIconCdnRegistry(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    if (workspace === null) {
      context.logger.error('Could not find workspace configuration file.');
      return;
    }

    // Ensure only application projects and projects with a build target
    // are targeted for the migration.
    const projects = Object.keys(workspace.projects).filter((p) => {
      const project = getProjectFromWorkspace(workspace, p);
      try {
        return (
          project.projectType === 'application' && !!getProjectTargetOptions(project, 'build').main
        );
      } catch {
        return false;
      }
    });

    return chain(projects.map((name) => addIconCdnProvider({ name })));
  };
}

/** Entry point for the migration schematics with target of sbb-angular 11.0.0 */
export function updateToV11(): Rule {
  // patchClassNamesMigration();
  return createMigrationSchematicRule(
    TargetVersion.V11,
    [IconMigration],
    sbbAngularUpgradeData,
    onMigrationComplete
  );
}

function patchClassNamesMigration() {
  const indexOfClassNamesMigration = cdkMigrations.findIndex(
    (m) => m.name === 'ClassNamesMigration'
  );
  cdkMigrations[indexOfClassNamesMigration] = ClassNamesMigration;
}

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean
) {
  context.logger.info('');
  context.logger.info(`  ✓  Updated @sbb-esta/angular-core to ${targetVersion}`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
