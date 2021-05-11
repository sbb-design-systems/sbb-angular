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

describe('ngAdd', () => {
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

    // Add contextmenu
    const workspace = await getWorkspace(tree);
    project = getProjectFromWorkspace(workspace, appOptions.name);
    appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    tree.overwrite(
      '/projects/dummy/src/app/app.component.html',
      `<sbb-contextmenu>
         <sbb-dropdown></sbb-dropdown>
       </sbb-contextmenu>`
    );
  });

  it('should import SbbIconModule when migrating sbb-contextmenu', async () => {
    expect(hasNgModuleImport(tree, appModulePath, 'SbbIconModule')).toBe(false);

    await runner.runSchematicAsync('ng-add-migrate', {}, tree).toPromise();

    expect(hasNgModuleImport(tree, appModulePath, 'SbbIconModule')).toBe(true);
  });

  it('should not import SbbIconModule when migrating sbb-contextmenu and SbbIconModule is already imported', async () => {
    addModuleImportToRootModule(tree, 'SbbIconModule', '@sbb-esta/angular/icon', project);
    expect(hasNgModuleImport(tree, appModulePath, 'SbbIconModule')).toBe(true);

    await runner.runSchematicAsync('ng-add-migrate', {}, tree).toPromise();

    expect((tree.readContent(appModulePath).match(/SbbIconModule/g) || []).length).toBe(
      2,
      'Expected to have two occurrences of SbbIconModule (one in import declaration and one in module imports).'
    );
  });
});
