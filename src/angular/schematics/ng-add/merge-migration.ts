import { chain, Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  UpdateBuffer2,
  UpdateBufferBase,
} from '@angular-devkit/schematics/src/utility/update-buffer';
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
import {
  migrateTypographyInAngularJson,
  StyleImportMigration,
} from './migrations/style-import-migration';
import { Schema } from './schema';

/** Entry point for the merge migration schematics */
export function mergePublicAndBusiness(options: Schema): Rule {
  patchUpdateBuffer();
  patchClassNamesMigration();
  return chain([
    migrateTypographyInAngularJson(options),
    createMigrationSchematicRule(
      'merge' as TargetVersion,
      [
        SecondaryEntryPointsMigration,
        EnumToStringLiteralMigration,
        MergeRefactorMigration,
        MenuMigration,
        StyleImportMigration,
      ],
      sbbAngularUpgradeData,
      onMigrationComplete
    ),
  ]);
}

function patchUpdateBuffer() {
  if (UpdateBufferBase.create) {
    UpdateBufferBase.create = (originalContent: Buffer): UpdateBufferBase =>
      new UpdateBuffer2(originalContent);
  }
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
  context.logger.info(
    `     Please manually remove deprecated dependencies from your package.json.`
  );
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be migrated automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
