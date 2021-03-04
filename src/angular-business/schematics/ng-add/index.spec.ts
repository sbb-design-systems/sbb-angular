import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { addPackageToPackageJson } from './package-config';
import { Schema } from './schema';
import {
  BROWSER_ANIMATIONS_MODULE_NAME,
  NOOP_ANIMATIONS_MODULE_NAME,
  TYPOGRAPHY_CSS_PATH,
} from './setup-project';

/** Path to the schematic collection that includes the migrations. */
// tslint:disable-next-line: naming-convention
export const collection = require.resolve('../collection.json');

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '11.0.0',
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

  /** Assert that file exists and parse json file to object */
  function readJsonFile(host: Tree, path: string) {
    if (!host.exists(path)) {
      throw new SchematicsException(path + ' not found');
    }
    return JSON.parse(host.read(path)!.toString('utf-8')) as any;
  }

  /** Assert that file exists and parse string file */
  function readStringFile(host: Tree, path: string) {
    if (!host.exists(path)) {
      throw new SchematicsException(path + ' not found');
    }
    return host.read(path)!.toString('utf-8');
  }

  beforeEach(async () => {
    runner = new SchematicTestRunner('collection', collection);
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise();
  });

  it('should cancel installation if public package is already installed', async () => {
    addPackageToPackageJson(tree, '@sbb-esta/angular-public', '0.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-public']).toBe(
      '0.0.0'
    );

    expect(runner.tasks.some((task) => task.name === 'run-schematic')).toBe(
      false,
      'Expected the setup-project schematic not to be scheduled.'
    );
  });

  it('should add @sbb-esta/angular-core, @angular/cdk and @angular/animations to "package.json" file', async () => {
    ['@sbb-esta/angular-core', '@angular/cdk'].forEach((dependencyName) =>
      expect(readJsonFile(tree, '/package.json').dependencies[dependencyName]).toBeUndefined()
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-core']).toBe(
      `~0.0.0-PLACEHOLDER`
    );

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe(`~0.0.0-CDK`);

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/animations']).toBeDefined();

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(runner.tasks.some((task) => task.name === 'run-schematic')).toBe(
      true,
      'Expected the setup-project schematic to be scheduled.'
    );
  });

  it('should do nothing if @sbb-esta/angular-core is in "package.json" file already', async () => {
    addPackageToPackageJson(tree, '@sbb-esta/angular-core', '0.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-core']).toBe(
      '0.0.0'
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-core']).toBe(
      '0.0.0'
    );

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(runner.tasks.some((task) => task.name === 'run-schematic')).toBe(
      true,
      'Expected the setup-project schematic to be scheduled.'
    );
  });

  it('should not abort when running ng add two times', async () => {
    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();
    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();
    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();
  });

  it('should add typography to angular.json and configure animationsModule', async () => {
    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/dummy/src/styles.css']);

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/dummy/src/styles.css']);

    expect(readStringFile(tree, '/projects/dummy/src/app/app.module.ts')).toContain(
      BROWSER_ANIMATIONS_MODULE_NAME
    );
  });

  it('should not add typography a second time if entry already exists', async () => {
    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();
    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/dummy/src/styles.css']);
  });

  it('should add styles node in angular.json if no styles node exists', async () => {
    const angularJson = readJsonFile(tree, '/angular.json');
    delete angularJson.projects.dummy.architect.build.options.styles;
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH]);
  });

  it('should add NoopAnimationsModule', async () => {
    await runner
      .runSchematicAsync('ng-add-setup-project', { animations: false } as Schema, tree)
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/app/app.module.ts')).toContain(
      NOOP_ANIMATIONS_MODULE_NAME
    );
  });
});
