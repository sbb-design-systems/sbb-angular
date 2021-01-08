import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import {
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
} from '@angular/cdk/schematics';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { hasNgModuleProvider, readStringFile } from '../utils';

import { ICON_CDN_REGISTRY_NAME } from './index';

/** Path to the schematic collection that includes the migrations. */
// tslint:disable-next-line: naming-convention
export const collection = require.resolve('../collection.json');

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '10.0.0',
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

  beforeEach(async () => {
    runner = new SchematicTestRunner('collection', collection);
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise();
  });

  it('should add ICON_CDN_REGISTRY_NAME to AppModule providers', async () => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, appOptions.name);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    expect(hasNgModuleProvider(tree, appModulePath, ICON_CDN_REGISTRY_NAME)).toBeFalse();

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/app/app.module.ts')).toContain(
      ICON_CDN_REGISTRY_NAME
    );
    expect(hasNgModuleProvider(tree, appModulePath, ICON_CDN_REGISTRY_NAME)).toBeTrue();
  });
});
