import { Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  cdkMigrations,
  createMigrationSchematicRule,
  TargetVersion,
} from '@angular/cdk/schematics';

import { ClassNamesMigration } from './migrations/class-names';
import { sbbAngularUpgradeData } from './upgrade-data';

/** Entry point for the migration schematics with target of Angular 15 */
export function updateToV15(): Rule {
  patchClassNamesMigration();
  return createMigrationSchematicRule(
    TargetVersion.V17,
    [],
    sbbAngularUpgradeData,
    onMigrationComplete,
  );
}

function patchClassNamesMigration() {
  const indexOfClassNamesMigration = cdkMigrations.findIndex(
    (m) => m.name === 'ClassNamesMigration',
  );
  cdkMigrations[indexOfClassNamesMigration] = ClassNamesMigration;
}

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean,
) {
  context.logger.info('');
  context.logger.info(`  ✓  Updated Sbb Angular to ${targetVersion}`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
        'output above and fix these issues manually.',
    );
  }
}
