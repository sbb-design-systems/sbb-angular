import { Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  cdkMigrations,
  createMigrationSchematicRule,
  TargetVersion,
} from '@angular/cdk/schematics';

import { sbbAngularUpgradeData } from './add-data';
import { ClassNamesMigration } from './migrations/class-names';
import { EnumToStringLiteralMigration } from './migrations/enum-to-string-literal-migration';
import { MenuMigration } from './migrations/menu-migration';
import { MergeRefactorMigration } from './migrations/merge-refactor-migration';
import { SecondaryEntryPointsMigration } from './migrations/secondary-entry-points-migration';

/** Entry point for the merge migration schematics */
export function mergePublicAndBusiness(): Rule {
  patchClassNamesMigration();
  return createMigrationSchematicRule(
    'merge' as TargetVersion,
    [
      SecondaryEntryPointsMigration,
      EnumToStringLiteralMigration,
      MergeRefactorMigration,
      MenuMigration,
    ],
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
  context.logger.info(
    `  ✓  Migrated from @sbb-esta/angular-business, @sbb-esta/angular-public and @sbb-esta/angular-core to @sbb-esta/angular.`
  );
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be migrated automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
