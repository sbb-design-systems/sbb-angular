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

import { ClassNamesMigration } from './migrations/class-names';
import { leanTestConfigurationMigration } from './migrations/lean-test-configuration-migration';
import { SecondaryEntryPointsMigration } from './migrations/secondary-entry-points-migration';
import { sbbAngularUpgradeData } from './upgrade-data';

/** Entry point for the migration schematics with target of SBB Angular v13 */
export function updateToV13(): Rule {
  patchUpdateBuffer();
  return chain([
    leanTestConfigurationMigration,
    createMigrationSchematicRule(TargetVersion.V13, [], sbbAngularUpgradeData, onMigrationComplete),
  ]);
}

/** Entry point for the migration schematics with target of Angular v14 */
export function updateToV14(): Rule {
  patchUpdateBuffer();
  patchClassNamesMigration();
  return createMigrationSchematicRule(
    TargetVersion.V14,
    [SecondaryEntryPointsMigration],
    sbbAngularUpgradeData,
    onMigrationComplete
  );
}

/** Entry point for the migration schematics with target of Angular 15 */
export function updateToV15(): Rule {
  patchUpdateBuffer();
  patchClassNamesMigration();
  return createMigrationSchematicRule(
    TargetVersion.V15,
    [],
    sbbAngularUpgradeData,
    onMigrationComplete
  );
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
  context.logger.info(`  ✓  Updated Sbb Angular to ${targetVersion}`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
