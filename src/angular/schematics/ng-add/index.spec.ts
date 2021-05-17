import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import {
  getAppModulePath,
  getProjectFromWorkspace,
  getProjectMainFile,
} from '@angular/cdk/schematics';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { COLLECTION_PATH } from '../index.spec';
import { hasNgModuleProvider } from '../utils';

import { addPackageToPackageJson } from './package-config';
import { Schema } from './schema';
import {
  BROWSER_ANIMATIONS_MODULE_NAME,
  ICON_CDN_REGISTRY_NAME,
  NOOP_ANIMATIONS_MODULE_NAME,
  TYPOGRAPHY_CSS_PATH,
} from './setup-project';

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
    runner = new SchematicTestRunner('collection', COLLECTION_PATH);
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    tree = await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise();
  });

  it('should cancel installation if angular package is already installed', async () => {
    addPackageToPackageJson(tree, '@sbb-esta/angular', '0.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular']).toBe('0.0.0');

    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(false, 'Expected the setup-project schematic not to be scheduled.');
  });

  it('should add @angular/cdk and @angular/animations to "package.json" file', async () => {
    ['@angular/cdk'].forEach((dependencyName) =>
      expect(readJsonFile(tree, '/package.json').dependencies[dependencyName]).toBeUndefined()
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe(`~0.0.0-CDK`);

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/animations']).toBeDefined();

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(true, 'Expected the setup-project schematic to be scheduled.');
  });

  it('should do nothing if @angular/cdk is in "package.json" file already', async () => {
    addPackageToPackageJson(tree, '@angular/cdk', '0.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe('0.0.0');

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe('0.0.0');

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(true, 'Expected the setup-project schematic to be scheduled.');
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

  it('should add ICON_CDN_REGISTRY_NAME to AppModule providers', async () => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, appOptions.name);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    expect(hasNgModuleProvider(tree, appModulePath, ICON_CDN_REGISTRY_NAME)).toBeFalse();

    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/app/app.module.ts')).toContain(
      ICON_CDN_REGISTRY_NAME
    );
    expect(hasNgModuleProvider(tree, appModulePath, ICON_CDN_REGISTRY_NAME)).toBeTrue();
  });

  it('should execute migration from public, business and core', async () => {
    addPackageToPackageJson(tree, '@sbb-esta/angular-business', '0.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-business']).toBe(
      '0.0.0'
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-migrate')).toBe(
      true,
      'Expected the ng-add-migrate schematic to be scheduled.'
    );
  });

  it('should not execute migration from public, business and core', async () => {
    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-migrate')).toBe(
      false,
      'Expected the ng-add-migrate schematic not to be scheduled.'
    );
  });
});
