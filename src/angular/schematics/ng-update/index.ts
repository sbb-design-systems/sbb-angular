import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { createMigrationSchematicRule, TargetVersion } from '@angular/cdk/schematics';

import { sbbAngularUpgradeData } from './upgrade-data';

/** Entry point for the migration schematics with target of Angular 18 */
export function updateToV18(): Rule {
  return createMigrationSchematicRule(
    TargetVersion.V19,
    [],
    sbbAngularUpgradeData,
    onMigrationComplete,
  );
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
