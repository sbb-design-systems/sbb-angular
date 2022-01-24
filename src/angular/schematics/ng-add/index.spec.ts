import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { COLLECTION_PATH } from '../paths';

import { addPackageToPackageJson } from './package-config';
import { Schema } from './schema';
import {
  BROWSER_ANIMATIONS_MODULE_NAME,
  NOOP_ANIMATIONS_MODULE_NAME,
  TYPOGRAPHY_CSS_PATH,
} from './setup-project';

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '13.0.0',
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
    return JSON.parse(host.read(path)!.toString('utf-8')) as Record<string, any>;
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
    tree = (await runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise())!;
    tree = (await runner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree)
      .toPromise())!;
  });

  it('should abort ng-add if @angular/core major version is below 13', async () => {
    tree.overwrite(
      '/package.json',
      readStringFile(tree, '/package.json').replace(
        /"@angular\/core": "(.*)",/g,
        '"@angular/core": "~12.0.0",'
      )
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(false, 'Expected the ng-add-setup-project schematic not to be scheduled.');
  });

  it('should abort ng-add if @angular/cdk major version is below 13', async () => {
    addPackageToPackageJson(tree, '@angular/cdk', '12.0.0');

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(false, 'Expected the ng-add-setup-project schematic not to be scheduled.');
  });

  it('should add @angular/cdk, @angular/animations and @angular/forms to "package.json" file', async () => {
    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBeUndefined();

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe(`0.0.0-CDK`);
    expect(readJsonFile(tree, '/package.json').dependencies['@angular/animations']).toBeDefined();
    expect(readJsonFile(tree, '/package.json').dependencies['@angular/forms']).toBeDefined();

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(true, 'Expected the setup-project schematic to be scheduled.');
  });

  it('should do nothing if @angular/cdk is in "package.json" file already', async () => {
    addPackageToPackageJson(tree, '@angular/cdk', '13.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe('13.0.0');

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe('13.0.0');

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

  it('should not add typography in angular.json if legacy typography import exists in styles.scss', async () => {
    tree.overwrite(
      'projects/dummy/src/styles.css',
      `@import '@sbb-esta/angular-public/typography.css'`
    );

    await runner.runSchematicAsync('ng-add-setup-project', {}, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual(['projects/dummy/src/styles.css']);

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.styles
    ).toEqual(['projects/dummy/src/styles.css']);
  });

  it('should not add typography in angular.json if legacy typography import exists in angular.json', async () => {
    const angularJson = readJsonFile(tree, '/angular.json');
    const legacyImport = 'node_modules/@sbb-esta/angular-business/typography.css';
    (angularJson.projects.dummy.architect.build.options.styles as string[]).push(legacyImport);
    (angularJson.projects.dummy.architect.test.options.styles as string[]).push(legacyImport);
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'lean (previously known as business)' } as Schema,
        tree
      )
      .toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual(['projects/dummy/src/styles.css', legacyImport]);

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.styles
    ).toEqual(['projects/dummy/src/styles.css', legacyImport]);

    // Should configure variant regardless of legacy packages
    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
      '<html class="sbb-lean" lang="en">'
    );
  });

  it('should add NoopAnimationsModule', async () => {
    await runner
      .runSchematicAsync('ng-add-setup-project', { animations: false } as Schema, tree)
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/app/app.module.ts')).toContain(
      NOOP_ANIMATIONS_MODULE_NAME
    );
  });

  it('should add sbb-lean class to index.html', async () => {
    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'lean (previously known as business)' } as Schema,
        tree
      )
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
      '<html class="sbb-lean" lang="en">'
    );

    // run migration a second time
    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'lean (previously known as business)' } as Schema,
        tree
      )
      .toPromise();

    // Lean-tag should still be there only once
    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
      '<html class="sbb-lean" lang="en">'
    );
  });

  it('should add sbb-lean class to index.html with other existing classes', async () => {
    tree.overwrite(
      'projects/dummy/src/index.html',
      `<html class='app-class' lang="en"><head></head><body></body></html>`
    );

    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'lean (previously known as business)' } as Schema,
        tree
      )
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
      `<html class='sbb-lean app-class' lang="en">`
    );
  });

  it('should not add sbb-lean class if standard variant was chosen', async () => {
    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'standard (previously known as public)' } as Schema,
        tree
      )
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain('<html lang="en">');
  });

  it('should remove sbb-lean class if standard variant was chosen but lean was set before', async () => {
    tree.overwrite(
      'projects/dummy/src/index.html',
      `<html class="sbb-lean app-class" lang="en"><head></head><body></body></html>`
    );

    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'standard (previously known as public)' } as Schema,
        tree
      )
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
      '<html class="app-class" lang="en">'
    );
  });

  it('should completely remove class attribute if no css classes are present anymore', async () => {
    tree.overwrite(
      'projects/dummy/src/index.html',
      `<html class="sbb-lean" lang="en"><head></head><body></body></html>`
    );

    await runner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: 'standard (previously known as public)' } as Schema,
        tree
      )
      .toPromise();

    expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain('<html lang="en">');
  });

  it('should execute migration from public, business and core', async () => {
    addPackageToPackageJson(tree, '@sbb-esta/angular-business', '12.0.0');
    expect(readJsonFile(tree, '/package.json').dependencies['@sbb-esta/angular-business']).toBe(
      '12.0.0'
    );

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-migrate'))
      .withContext('Expected the ng-add-migrate schematic to be scheduled.')
      .toBe(true);
  });

  it('should not execute migration from public, business and core', async () => {
    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-migrate'))
      .withContext('Expected the ng-add-migrate schematic not to be scheduled.')
      .toBe(false);
  });

  it('should not execute migration from public, business and core if major versions are not 12', async () => {
    addPackageToPackageJson(tree, '@sbb-esta/angular-business', '11.0.0');

    await runner.runSchematicAsync('ng-add', {}, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-migrate'))
      .withContext('Expected the ng-add-migrate schematic not to be scheduled.')
      .toBe(false);
  });
});
