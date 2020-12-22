import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { createMigrationSchematicRule, TargetVersion } from '@angular/cdk/schematics';

import { sbbAngularUpgradeData } from './add-data';
import { SecondaryEntryPointsMigration } from './migrations/secondary-entry-points-migration';

/** Entry point for the merge migration schematics */
export function mergePublicAndBusiness(): Rule {
  return createMigrationSchematicRule(
    'merge' as TargetVersion,
    [SecondaryEntryPointsMigration],
    sbbAngularUpgradeData,
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
  context.logger.info(
    `  ✓  Migrated from @sbb-esta/angular-business and @sbb-esta/angular-public to @sbb-esta/angular.`
  );
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be migrated automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
