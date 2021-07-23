import { Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  cdkMigrations,
  createMigrationSchematicRule,
  TargetVersion,
} from '@angular/cdk/schematics';

import { DuplicateMigration } from './migrations/duplicate-migration';

/** Entry point for the migration clean-up schematics */
export function cleanUp(): Rule {
  // Remove all CDK migrations, since they are executed with the merge migration.
  cdkMigrations.splice(0, cdkMigrations.length);
  return createMigrationSchematicRule(
    'merge' as TargetVersion,
    [DuplicateMigration],
    {} as any,
    onMigrationComplete
  );
}

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean
) {
  context.logger.info('');
  context.logger.info(`  ✓  Clean-up of migrations complete.`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be migrated automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
