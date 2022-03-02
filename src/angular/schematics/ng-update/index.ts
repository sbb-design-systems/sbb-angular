import { chain, Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  createMigrationSchematicRule,
  NullableDevkitMigration,
  TargetVersion,
} from '@angular/cdk/schematics';

import { leanTestConfigurationMigration } from './migrations/lean-test-configuration-migration';
import { sbbAngularUpgradeData } from './upgrade-data';

const sbbAngularMigrations: NullableDevkitMigration[] = [];

/** Entry point for the migration schematics with target of SBB Angular v13 */
export function updateToV13(): Rule {
  return chain([
    leanTestConfigurationMigration,
    createMigrationSchematicRule(
      TargetVersion.V13,
      sbbAngularMigrations,
      sbbAngularUpgradeData,
      onMigrationComplete
    ),
  ]);
}

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean
) {
  context.logger.info('');
  context.logger.info(`  ✓  Updated Sbb Angular to ${targetVersion}`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
