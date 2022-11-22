import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { addModuleImportToRootModule } from '@angular/cdk/schematics';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { COLLECTION_PATH } from '../paths';

import { addPackageToPackageJson } from './package-config';
import { Schema } from './schema';
import {
  BROWSER_ANIMATIONS_MODULE_NAME,
  LEAN_TEST_POLYFILL_PATH,
  NOOP_ANIMATIONS_MODULE_NAME,
  TYPOGRAPHY_CSS_PATH,
} from './setup-project';

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '14.0.0',
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
  const baseOptions = { project: appOptions.name };
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;
  let errorOutput: string[];

  function runNgAddSetupProject(
    testRunner: SchematicTestRunner,
    testTree: UnitTestTree,
    variant: 'standard' | 'lean'
  ) {
    const variantFull =
      variant === 'standard'
        ? 'standard (previously known as public)'
        : 'lean (previously known as business)';
    return testRunner
      .runSchematicAsync(
        'ng-add-setup-project',
        { variant: variantFull, ...baseOptions } as Schema,
        testTree
      )
      .toPromise();
  }

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

    errorOutput = [];
    runner.logger.subscribe((e) => {
      if (e.level === 'error') {
        errorOutput.push(e.message);
      }
    });
  });

  it('should abort ng-add if @angular/core major version is below 14', async () => {
    tree.overwrite(
      '/package.json',
      readStringFile(tree, '/package.json').replace(
        /"@angular\/core": "(.*)",/g,
        '"@angular/core": "~13.0.0",'
      )
    );

    await runner.runSchematicAsync('ng-add', baseOptions, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project'))
      .withContext('Expected the ng-add-setup-project schematic not to be scheduled.')
      .toBe(false);
  });

  it('should abort ng-add if @angular/cdk major version is below 13', async () => {
    addPackageToPackageJson(tree, '@angular/cdk', '13.0.0');

    await runner.runSchematicAsync('ng-add', baseOptions, tree).toPromise();

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project'))
      .withContext('Expected the ng-add-setup-project schematic not to be scheduled.')
      .toBe(false);
  });

  it('should add @angular/cdk, @angular/animations and @angular/forms to "package.json" file', async () => {
    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBeUndefined();

    await runner.runSchematicAsync('ng-add', baseOptions, tree).toPromise();

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
    addPackageToPackageJson(tree, '@angular/cdk', '14.0.0');

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe('14.0.0');

    await runner.runSchematicAsync('ng-add', baseOptions, tree).toPromise();

    expect(readJsonFile(tree, '/package.json').dependencies['@angular/cdk']).toBe('14.0.0');

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project')
    ).toBe(true, 'Expected the setup-project schematic to be scheduled.');
  });

  it('should not abort when running ng add two times', async () => {
    await runner.runSchematicAsync('ng-add', baseOptions, tree).toPromise();
    await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();
    await runner.runSchematicAsync('ng-add', baseOptions, tree).toPromise();
    await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();
  });

  it('should add typography to angular.json and configure animationsModule', async () => {
    await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();

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
    await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();
    await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/dummy/src/styles.css']);
  });

  it('should add styles node in angular.json if no styles node exists', async () => {
    const angularJson = readJsonFile(tree, '/angular.json');
    delete angularJson.projects.dummy.architect.build.options.styles;
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();

    expect(
      readJsonFile(tree, '/angular.json').projects.dummy.architect.build.options.styles
    ).toEqual([TYPOGRAPHY_CSS_PATH]);
  });

  describe('animations enabled', () => {
    it('should add the BrowserAnimationsModule to the project module', async () => {
      await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();
      const fileContent = readStringFile(tree, '/projects/dummy/src/app/app.module.ts');
      expect(fileContent)
        .withContext('Expected the project app module to import the "BrowserAnimationsModule".')
        .toContain('BrowserAnimationsModule');
    });

    it('should not add BrowserAnimationsModule if NoopAnimationsModule is set up', async () => {
      const workspace = await getWorkspace(tree);
      const projects = Array.from(workspace.projects.values());
      expect(projects.length).toBe(1);
      const [project] = projects;
      // Simulate the case where a developer uses `ng-add` on an Angular CLI project which already
      // explicitly uses the `NoopAnimationsModule`. It would be wrong to forcibly enable browser
      // animations without knowing what other components would be affected. In this case, we
      // just print a warning message.
      addModuleImportToRootModule(
        tree,
        'NoopAnimationsModule',
        '@angular/platform-browser/animations',
        project
      );
      await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();
      expect(errorOutput.length).toBe(1);
      expect(errorOutput[0]).toMatch(/Could not set up "BrowserAnimationsModule"/);
    });

    it('should add the BrowserAnimationsModule to a bootstrapApplication call', async () => {
      tree.delete('/projects/dummy/src/app/app.module.ts');
      tree.overwrite(
        '/projects/dummy/src/main.ts',
        `
          import { importProvidersFrom } from '@angular/core';
          import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
          import { AppComponent } from './app/app.component';
          bootstrapApplication(AppComponent, {
            providers: [{provide: 'foo', useValue: 1}, importProvidersFrom(BrowserModule)]
          });
        `
      );

      await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();
      const fileContent = readStringFile(tree, '/projects/dummy/src/main.ts');
      expect(fileContent).toContain('importProvidersFrom(BrowserModule, BrowserAnimationsModule)');
    });

    it('should not add BrowserAnimationsModule if NoopAnimationsModule is set up in a bootstrapApplication call', async () => {
      tree.delete('/projects/dummy/src/app/app.module.ts');
      tree.overwrite(
        '/projects/dummy/src/main.ts',
        `
          import { importProvidersFrom } from '@angular/core';
          import { bootstrapApplication } from '@angular/platform-browser';
          import { NoopAnimationsModule } from '@angular/platform-browser/animations';
          import { AppComponent } from './app/app.component';

          bootstrapApplication(AppComponent, {
            providers: [{provide: 'foo', useValue: 1}, importProvidersFrom(NoopAnimationsModule)]
          });
        `
      );

      await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();

      expect(errorOutput.length).toBe(1);
      expect(errorOutput[0]).toMatch(
        /Could not set up "BrowserAnimationsModule" because "NoopAnimationsModule" is already imported/
      );
    });
  });

  describe('animations disabled', () => {
    it('should add NoopAnimationsModule', async () => {
      await runner
        .runSchematicAsync(
          'ng-add-setup-project',
          { animations: 'disabled', ...baseOptions } as Schema,
          tree
        )
        .toPromise();

      expect(readStringFile(tree, '/projects/dummy/src/app/app.module.ts'))
        .withContext('Expected the project app module to import the "NoopAnimationsModule".')
        .toContain(NOOP_ANIMATIONS_MODULE_NAME);
    });

    it('should not add NoopAnimationsModule if BrowserAnimationsModule is set up', async () => {
      const workspace = await getWorkspace(tree);
      const projects = Array.from(workspace.projects.values());
      expect(projects.length).toBe(1);
      const project = projects[0];
      // Simulate the case where a developer uses `ng-add` on an Angular CLI project which already
      // explicitly uses the `BrowserAnimationsModule`. It would be wrong to forcibly change
      // to noop animations.
      addModuleImportToRootModule(
        tree,
        'BrowserAnimationsModule',
        '@angular/platform-browser/animations',
        project
      );

      const fileContent = readStringFile(tree, '/projects/dummy/src/app/app.module.ts');

      expect(fileContent).not.toContain(
        'NoopAnimationsModule',
        'Expected the project app module to not import the "NoopAnimationsModule".'
      );
    });
  });

  describe('animations excluded', () => {
    it('should not add any animations code if animations are excluded', async () => {
      const localTree = await runner
        .runSchematicAsync('ng-add-setup-project', { animations: 'excluded', ...baseOptions }, tree)
        .toPromise();
      const fileContent = readStringFile(localTree!, '/projects/dummy/src/app/app.module.ts');

      expect(fileContent).not.toContain('NoopAnimationsModule');
      expect(fileContent).not.toContain('BrowserAnimationsModule');
      expect(fileContent).not.toContain('@angular/platform-browser/animations');
      expect(fileContent).not.toContain('@angular/animations');
    });
  });

  describe('index.html manipulation', () => {
    it('should add sbb-lean class to index.html', async () => {
      await runNgAddSetupProject(runner, tree, 'lean');

      expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
        '<html class="sbb-lean" lang="en">'
      );

      // run migration a second time
      await runNgAddSetupProject(runner, tree, 'lean');

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

      await runNgAddSetupProject(runner, tree, 'lean');

      expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
        `<html class='sbb-lean app-class' lang="en">`
      );
    });

    it('should not add sbb-lean class if standard variant was chosen', async () => {
      await runNgAddSetupProject(runner, tree, 'standard');

      expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain('<html lang="en">');
    });

    it('should remove sbb-lean class if standard variant was chosen but lean was set before', async () => {
      tree.overwrite(
        'projects/dummy/src/index.html',
        `<html class="sbb-lean app-class" lang="en"><head></head><body></body></html>`
      );

      await runNgAddSetupProject(runner, tree, 'standard');

      expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain(
        '<html class="app-class" lang="en">'
      );
    });

    it('should completely remove class attribute if no css classes are present anymore', async () => {
      tree.overwrite(
        'projects/dummy/src/index.html',
        `<html class="sbb-lean" lang="en"><head></head><body></body></html>`
      );

      await runNgAddSetupProject(runner, tree, 'standard');

      expect(readStringFile(tree, '/projects/dummy/src/index.html')).toContain('<html lang="en">');
    });
  });

  describe('lean test polyfill', () => {
    const leanOptions = { ...baseOptions, variant: 'lean (previously known as business)' };

    it('should be added to polyfills array in angular.json', async () => {
      await runNgAddSetupProject(runner, tree, 'lean');

      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).toEqual(['zone.js', 'zone.js/testing', LEAN_TEST_POLYFILL_PATH]);
    });

    it('should not be added twice to polyfills array in angular.json', async () => {
      await runNgAddSetupProject(runner, tree, 'lean');
      await runNgAddSetupProject(runner, tree, 'lean');

      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).toEqual(['zone.js', 'zone.js/testing', LEAN_TEST_POLYFILL_PATH]);
    });

    it('should be added to polyfills string in angular.json', async () => {
      const angularJson = readJsonFile(tree, '/angular.json');
      angularJson.projects.dummy.architect.test.options.polyfills = 'dummy-polyfill.js';
      tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

      await runner.runSchematicAsync('ng-add-setup-project', leanOptions, tree).toPromise();

      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).toEqual(['dummy-polyfill.js', LEAN_TEST_POLYFILL_PATH]);
    });

    it('should throw an error if polyfill cannot be added', async () => {
      const angularJson = readJsonFile(tree, '/angular.json');
      angularJson.projects.dummy.architect.test.options.polyfills = { that: 'is not valid' };
      tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

      expect(errorOutput.length).toBe(0);

      await runner.runSchematicAsync('ng-add-setup-project', leanOptions, tree).toPromise();

      expect(errorOutput.length).toBe(1);
    });

    it('should not be added in standard variant', async () => {
      await runNgAddSetupProject(runner, tree, 'standard');

      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).toEqual(['zone.js', 'zone.js/testing']);
    });

    it('should be removed from polyfills array in standard variant', async () => {
      await runNgAddSetupProject(runner, tree, 'lean');
      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).toContain(LEAN_TEST_POLYFILL_PATH);

      await runNgAddSetupProject(runner, tree, 'standard');
      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).not.toContain(LEAN_TEST_POLYFILL_PATH);
    });

    it('should be removed from polyfills string in standard variant', async () => {
      const angularJson = readJsonFile(tree, '/angular.json');
      angularJson.projects.dummy.architect.test.options.polyfills = LEAN_TEST_POLYFILL_PATH;
      tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

      await runner.runSchematicAsync('ng-add-setup-project', baseOptions, tree).toPromise();

      expect(
        readJsonFile(tree, '/angular.json').projects.dummy.architect.test.options.polyfills
      ).toBeUndefined();
    });
  });
});
