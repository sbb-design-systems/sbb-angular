import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { COLLECTION_PATH } from '../paths';
import { createTestApp, getFileContent } from '../testing';

import { addPackageToPackageJson } from './package-config';
import { LEAN_TEST_POLYFILL_PATH, TYPOGRAPHY_CSS_PATH } from './setup-project';

describe('ngAdd', () => {
  const baseOptions = { project: 'sbb-angular' };
  const leanBaseOptions = { ...baseOptions, variant: 'lean (previously known as business)' };

  let runner: SchematicTestRunner;
  let appTree: Tree;
  let errorOutput: string[];

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
    appTree = await createTestApp(runner, { standalone: false });

    errorOutput = [];
    runner.logger.subscribe((e) => {
      if (e.level === 'error') {
        errorOutput.push(e.message);
      }
    });
  });

  it('should abort ng-add if @angular/core major version is below 14', async () => {
    appTree.overwrite(
      '/package.json',
      readStringFile(appTree, '/package.json').replace(
        /"@angular\/core": "(.*)",/g,
        '"@angular/core": "~13.0.0",',
      ),
    );

    await runner.runSchematic('ng-add', baseOptions, appTree);

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project'))
      .withContext('Expected the ng-add-setup-project schematic not to be scheduled.')
      .toBe(false);
  });

  it('should abort ng-add if @angular/cdk major version is below 13', async () => {
    addPackageToPackageJson(appTree, '@angular/cdk', '13.0.0');

    await runner.runSchematic('ng-add', baseOptions, appTree);

    expect(runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project'))
      .withContext('Expected the ng-add-setup-project schematic not to be scheduled.')
      .toBe(false);
  });

  it('should add @angular/cdk, @angular/animations and @angular/forms to "package.json" file', async () => {
    expect(readJsonFile(appTree, '/package.json')['dependencies']['@angular/cdk']).toBeUndefined();

    const tree = await runner.runSchematic('ng-add', baseOptions, appTree);

    expect(readJsonFile(tree, '/package.json')['dependencies']['@angular/cdk']).toBe(`0.0.0-CDK`);
    expect(
      readJsonFile(tree, '/package.json')['dependencies']['@angular/animations'],
    ).toBeDefined();
    expect(readJsonFile(tree, '/package.json')['dependencies']['@angular/forms']).toBeDefined();

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project'),
    ).toBe(true, 'Expected the setup-project schematic to be scheduled.');
  });

  it('should do nothing if @angular/cdk is in "package.json" file already', async () => {
    addPackageToPackageJson(appTree, '@angular/cdk', '14.0.0');

    expect(readJsonFile(appTree, '/package.json')['dependencies']['@angular/cdk']).toBe('14.0.0');

    const tree = await runner.runSchematic('ng-add', baseOptions, appTree);

    expect(readJsonFile(tree, '/package.json')['dependencies']['@angular/cdk']).toBe('14.0.0');

    // expect that there is a "node-package" install task. The task is
    // needed to update the lock file.
    expect(runner.tasks.some((task) => task.name === 'node-package')).toBe(true);
    expect(
      runner.tasks.some((task) => (task.options as any)!.name === 'ng-add-setup-project'),
    ).toBe(true, 'Expected the setup-project schematic to be scheduled.');
  });

  it('should not abort when running ng add two times', async () => {
    await runner.runSchematic('ng-add', baseOptions, appTree);
    await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);
    await runner.runSchematic('ng-add', baseOptions, appTree);
    await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);
  });

  it('should add typography to angular.json and configure animationsModule', async () => {
    const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

    expect(
      readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.build.options.styles,
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/sbb-angular/src/styles.css']);

    expect(
      readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.test.options.styles,
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/sbb-angular/src/styles.css']);

    const fileContent = getFileContent(tree, '/projects/sbb-angular/src/app/app.module.ts');

    expect(fileContent).toContain(
      `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
    );
    expect(fileContent).toContain(`provideAnimationsAsync()`);
  });

  it('should not add typography a second time if entry already exists', async () => {
    await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);
    await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

    expect(
      readJsonFile(appTree, '/angular.json')['projects']['sbb-angular'].architect.build.options
        .styles,
    ).toEqual([TYPOGRAPHY_CSS_PATH, 'projects/sbb-angular/src/styles.css']);
  });

  it('should add styles node in angular.json if no styles node exists', async () => {
    const angularJson = readJsonFile(appTree, '/angular.json');
    delete angularJson['projects']['sbb-angular'].architect.build.options.styles;
    appTree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

    expect(
      readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.build.options.styles,
    ).toEqual([TYPOGRAPHY_CSS_PATH]);
  });

  it('should add provideAnimationsAsync to the project module', async () => {
    const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);
    const fileContent = getFileContent(tree, '/projects/sbb-angular/src/app/app.module.ts');

    expect(fileContent).toContain('provideAnimationsAsync()');
    expect(fileContent).toContain(
      `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
    );
  });

  it('should add the provideAnimationsAsync to a bootstrapApplication call', async () => {
    appTree.delete('/projects/sbb-angular/src/app/app.module.ts');
    appTree.create(
      '/projects/sbb-angular/src/app/app.config.ts',
      `
      export const appConfig = {
        providers: [{ provide: 'foo', useValue: 1 }]
      };
    `,
    );
    appTree.overwrite(
      '/projects/sbb-angular/src/main.ts',
      `
        import { bootstrapApplication } from '@angular/platform-browser';
        import { AppComponent } from './app/app.component';
        import { appConfig } from './app/app.config';

        bootstrapApplication(AppComponent, appConfig);
      `,
    );

    const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);
    const fileContent = getFileContent(tree, '/projects/sbb-angular/src/app/app.config.ts');

    expect(fileContent).toContain(
      `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
    );
    expect(fileContent).toContain(`[{ provide: 'foo', useValue: 1 }, provideAnimationsAsync()]`);
  });

  it("should add the provideAnimationAsync('noop') to the project module if animations are disabled", async () => {
    const tree = await runner.runSchematic(
      'ng-add-setup-project',
      { ...baseOptions, animations: 'disabled' },
      appTree,
    );
    const fileContent = getFileContent(tree, '/projects/sbb-angular/src/app/app.module.ts');

    expect(fileContent).toContain(`provideAnimationsAsync('noop')`);
    expect(fileContent).toContain(
      `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
    );
  });

  it('should not add any animations code if animations are excluded', async () => {
    const tree = await runner.runSchematic(
      'ng-add-setup-project',
      { ...baseOptions, animations: 'excluded' },
      appTree,
    );
    const fileContent = getFileContent(tree, '/projects/sbb-angular/src/app/app.module.ts');

    expect(fileContent).not.toContain('provideAnimationsAsync');
    expect(fileContent).not.toContain('@angular/platform-browser/animations');
    expect(fileContent).not.toContain('@angular/animations');
  });

  describe('index.html manipulation', () => {
    it('should add sbb-lean class to index.html', async () => {
      let tree = await runner.runSchematic('ng-add-setup-project', leanBaseOptions, appTree);

      expect(readStringFile(tree, '/projects/sbb-angular/src/index.html')).toContain(
        '<html class="sbb-lean" lang="en">',
      );

      // run migration a second time
      tree = await runner.runSchematic('ng-add-setup-project', leanBaseOptions, tree);

      // Lean-tag should still be there only once
      expect(readStringFile(tree, '/projects/sbb-angular/src/index.html')).toContain(
        '<html class="sbb-lean" lang="en">',
      );
    });

    it('should add sbb-lean class to index.html with other existing classes', async () => {
      appTree.overwrite(
        'projects/sbb-angular/src/index.html',
        `<html class='app-class' lang="en"><head></head><body></body></html>`,
      );

      const tree = await runner.runSchematic('ng-add-setup-project', leanBaseOptions, appTree);

      expect(readStringFile(tree, '/projects/sbb-angular/src/index.html')).toContain(
        `<html class='sbb-lean app-class' lang="en">`,
      );
    });

    it('should not add sbb-lean class if standard variant was chosen', async () => {
      const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

      expect(readStringFile(tree, '/projects/sbb-angular/src/index.html')).toContain(
        '<html lang="en">',
      );
    });

    it('should remove sbb-lean class if standard variant was chosen but lean was set before', async () => {
      appTree.overwrite(
        'projects/sbb-angular/src/index.html',
        `<html class="sbb-lean app-class" lang="en"><head></head><body></body></html>`,
      );

      const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

      expect(readStringFile(tree, '/projects/sbb-angular/src/index.html')).toContain(
        '<html class="app-class" lang="en">',
      );
    });

    it('should completely remove class attribute if no css classes are present anymore', async () => {
      appTree.overwrite(
        'projects/sbb-angular/src/index.html',
        `<html class="sbb-lean" lang="en"><head></head><body></body></html>`,
      );

      const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

      expect(readStringFile(tree, '/projects/sbb-angular/src/index.html')).toContain(
        '<html lang="en">',
      );
    });
  });

  describe('lean test polyfill', () => {
    const leanOptions = { ...baseOptions, variant: 'lean (previously known as business)' };

    it('should be added to polyfills array in angular.json', async () => {
      const tree = await runner.runSchematic('ng-add-setup-project', leanOptions, appTree);

      expect(
        readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).toEqual(['zone.js', 'zone.js/testing', LEAN_TEST_POLYFILL_PATH]);
    });

    it('should not be added twice to polyfills array in angular.json', async () => {
      await runner.runSchematic('ng-add-setup-project', leanOptions, appTree);
      await runner.runSchematic('ng-add-setup-project', leanOptions, appTree);

      expect(
        readJsonFile(appTree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).toEqual(['zone.js', 'zone.js/testing', LEAN_TEST_POLYFILL_PATH]);
    });

    it('should be added to polyfills string in angular.json', async () => {
      const angularJson = readJsonFile(appTree, '/angular.json');
      angularJson['projects']['sbb-angular'].architect.test.options.polyfills = 'dummy-polyfill.js';
      appTree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

      const tree = await runner.runSchematic('ng-add-setup-project', leanOptions, appTree);

      expect(
        readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).toEqual(['dummy-polyfill.js', LEAN_TEST_POLYFILL_PATH]);
    });

    it('should throw an error if polyfill cannot be added', async () => {
      const angularJson = readJsonFile(appTree, '/angular.json');
      angularJson['projects']['sbb-angular'].architect.test.options.polyfills = {
        that: 'is not valid',
      };
      appTree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

      expect(errorOutput.length).toBe(0);

      await runner.runSchematic('ng-add-setup-project', leanOptions, appTree);

      expect(errorOutput.length).toBe(1);
    });

    it('should not be added in standard variant', async () => {
      const tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

      expect(
        readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).toEqual(['zone.js', 'zone.js/testing']);
    });

    it('should be removed from polyfills array in standard variant', async () => {
      let tree = await runner.runSchematic('ng-add-setup-project', leanOptions, appTree);
      expect(
        readJsonFile(appTree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).toContain(LEAN_TEST_POLYFILL_PATH);

      tree = await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

      expect(
        readJsonFile(tree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).not.toContain(LEAN_TEST_POLYFILL_PATH);
    });

    it('should be removed from polyfills string in standard variant', async () => {
      const angularJson = readJsonFile(appTree, '/angular.json');
      angularJson['projects']['sbb-angular'].architect.test.options.polyfills =
        LEAN_TEST_POLYFILL_PATH;
      appTree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

      await runner.runSchematic('ng-add-setup-project', baseOptions, appTree);

      expect(
        readJsonFile(appTree, '/angular.json')['projects']['sbb-angular'].architect.test.options
          .polyfills,
      ).toBeUndefined();
    });
  });
});
