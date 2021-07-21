import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import {
  addModuleImportToRootModule,
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
  hasNgModuleImport,
} from '@angular/cdk/schematics';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

/** Path to the schematic collection that includes the migrations. */
export const collection = require.resolve('../../collection.json');

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '12.0.0',
};

const appOptions: ApplicationOptions = {
  inlineStyle: false,
  inlineTemplate: false,
  name: 'dummy',
  routing: false,
  skipPackageJson: false,
  skipTests: false,
  style: Style.Css,
};

describe('MergeRefactorMigration', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;
  let project: ProjectDefinition;
  let appModulePath: string;

  beforeEach(async () => {
    runner = new SchematicTestRunner('collection', collection);
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise();

    // Add sbb-tabs
    const workspace = await getWorkspace(tree);
    project = getProjectFromWorkspace(workspace, appOptions.name);
    appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    tree.overwrite(
      '/projects/dummy/src/app/app.component.html',
      `<sbb-tabs>
        <sbb-tab label="Test" labelId="test1"></sbb-tab>
        <sbb-tab label="Test 2" labelId="test2" [badgePill]="5"></sbb-tab>
      </sbb-tabs>`
    );
  });

  it('should import SbbBadgeModule when migrating sbb-tabs with badgePill', async () => {
    expect(hasNgModuleImport(tree, appModulePath, 'SbbBadgeModule')).toBe(false);

    await runner.runSchematicAsync('ng-add-migrate', {}, tree).toPromise();

    expect(hasNgModuleImport(tree, appModulePath, 'SbbBadgeModule')).toBe(true);
  });

  it('should not import SbbBadgeModule when migrating sbb-tabs with badgePill and SbbBadgeModule is already imported', async () => {
    addModuleImportToRootModule(tree, 'SbbBadgeModule', '@sbb-esta/angular/badge', project);
    expect(hasNgModuleImport(tree, appModulePath, 'SbbBadgeModule')).toBe(true);

    await runner.runSchematicAsync('ng-add-migrate', {}, tree).toPromise();

    expect((tree.readContent(appModulePath).match(/SbbBadgeModule/g) || []).length).toBe(
      2,
      'Expected to have two occurrences of SbbBadgeModule (one in import declaration and one in module imports).'
    );
  });
});
