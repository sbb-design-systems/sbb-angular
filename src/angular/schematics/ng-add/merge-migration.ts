import { Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  cdkMigrations,
  createMigrationSchematicRule,
  TargetVersion,
} from '@angular/cdk/schematics';

import { sbbAngularUpgradeData } from './add-data';
import { BadgeMigration } from './migrations/badge-migration';
import { ButtonMigration } from './migrations/button-migration';
import { ClassNamesMigration } from './migrations/class-names';
import { EnumToStringLiteralMigration } from './migrations/enum-to-string-literal-migration';
import { MenuMigration } from './migrations/menu-migration';
import { PaginationMigration } from './migrations/pagination-migration';
import { SearchMigration } from './migrations/search-migration';
import { SecondaryEntryPointsMigration } from './migrations/secondary-entry-points-migration';
import { SelectionPanelMigration } from './migrations/selection-panel-migration';

/** Entry point for the merge migration schematics */
export function mergePublicAndBusiness(): Rule {
  patchClassNamesMigration();
  return createMigrationSchematicRule(
    'merge' as TargetVersion,
    [
      SecondaryEntryPointsMigration,
      ButtonMigration,
      SelectionPanelMigration,
      EnumToStringLiteralMigration,
      MenuMigration,
      SearchMigration,
      BadgeMigration,
      PaginationMigration,
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
