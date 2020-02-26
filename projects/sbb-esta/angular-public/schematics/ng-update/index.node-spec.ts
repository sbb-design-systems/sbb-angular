import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { addPackageToPackageJson } from '@angular/cdk/schematics/ng-add/package-config';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

/** Path to the schematic collection that includes the migrations. */
// tslint:disable-next-line: naming-convention
export const migrationCollection = require.resolve('../migration.json');

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '9.0.0'
};

const appOptions: ApplicationOptions = {
  inlineStyle: false,
  inlineTemplate: false,
  name: 'dummy',
  routing: false,
  skipPackageJson: false,
  skipTests: false,
  style: Style.Css
};

describe('updateToV9', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('migrations', migrationCollection);
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise();
  });

  describe('@sbb-esta/angular-core not installed', () => {
    it('should add @sbb-esta/angular-core to "package.json" file', async () => {
      expect(
        JSON.parse(tree.readContent('/package.json')).dependencies['@sbb-esta/angular-core']
      ).toBeUndefined();

      await runner.runSchematicAsync('migration-v9', {}, tree).toPromise();

      expect(
        JSON.parse(tree.readContent('/package.json')).dependencies['@sbb-esta/angular-core']
      ).toBe(require('../../package.json').version);

      // expect that there is a "node-package" install task. The task is
      // needed to update the lock file.
      expect(runner.tasks.some(t => t.name === 'node-package')).toBe(true);
    });

    it('should do nothing if @sbb-esta/angular-core is in "package.json" file', async () => {
      addPackageToPackageJson(tree, '@sbb-esta/angular-core', '0.0.0');

      expect(
        JSON.parse(tree.readContent('/package.json')).dependencies['@sbb-esta/angular-core']
      ).toBe('0.0.0');

      await runner.runSchematicAsync('migration-v9', {}, tree).toPromise();

      expect(
        JSON.parse(tree.readContent('/package.json')).dependencies['@sbb-esta/angular-core']
      ).toBe('0.0.0');

      // expect that there is a "node-package" install task. The task is
      // needed to update the lock file.
      expect(runner.tasks.some(t => t.name === 'node-package')).toBe(true);
    });
  });
});
