import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { addDefaultDependency, readJsonFile } from '../helpers';

import { TYPOGRAPHY_CSS_PATH } from './index';

/** Path to the schematic collection that includes the migrations. */
// tslint:disable-next-line: naming-convention
export const collection = require.resolve('../collection.json');

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

  it('should add @sbb-esta/angular-core, @sbb-esta/angular-icons and @angular/cdk to "package.json" file, should add typography to angular.json', async () => {
    ['@sbb-esta/angular-core', '@sbb-esta/angular-icons', '@angular/cdk'].forEach(dependencyName =>
      expect(readJsonFile(tree, '/package.json').dependencies[dependencyName]).toBeUndefined()
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    ['@sbb-esta/angular-core', '@sbb-esta/angular-icons'].forEach(dependencyName =>
      expect(readJsonFile(tree, '/package.json').dependencies[dependencyName]).toBe(
        require('../../package.json').version
      )
    );

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe(
      require('../../package.json').peerDependencies['@angular/cdk']
    );

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual(['projects/dummy/src/styles.css', TYPOGRAPHY_CSS_PATH]);

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.styles
    ).toEqual(['projects/dummy/src/styles.css', TYPOGRAPHY_CSS_PATH]);

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some(t => t.name === 'node-package')).toBe(true);
  });

  it('should do nothing if @sbb-esta/angular-core is in "package.json" file already', async () => {
    addDefaultDependency('@sbb-esta/angular-core', '0.0.0', tree);

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-core']).toBe(
      '0.0.0'
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-core']).toBe(
      '0.0.0'
    );

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some(t => t.name === 'node-package')).toBe(true);
  });

  it('should cancel installation if business package is already installed', async () => {
    addDefaultDependency('@sbb-esta/angular-business', '0.0.0', tree);

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-business']).toBe(
      '0.0.0'
    );

    await expectAsync(runner.runSchematicAsync('ng-add', {}, tree).toPromise()).toBeRejected();
  });

  it('should not add typography if entry already exists', async () => {
    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual(['projects/dummy/src/styles.css', TYPOGRAPHY_CSS_PATH]);
  });

  it('should add styles node in angular.json if no styles node exists', async () => {
    const angularJson = readJsonFile(tree, '/angular.json');
    delete angularJson.projects.dummy.architect.build.options.styles;
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH]);
  });
});
