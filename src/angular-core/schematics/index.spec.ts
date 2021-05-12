/**
 * Path to the schematic collection that includes the migrations. Needs to use
 * the workspace path as otherwise the resolution won't work on Windows.
 */
export const MIGRATION_PATH = require.resolve(
  'sbb_angular/src/angular-core/schematics/migration.json'
);
