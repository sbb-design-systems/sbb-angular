import { SchematicsException } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createTestCaseSetup } from '@sbb-esta/angular/schematics/testing';
import { join } from 'path';

/** Path to the schematic collection that includes the migrations. */
export const collection = require.resolve('../../collection.json');

describe('style import migration', () => {
  const projectPath = '/projects/cdk-testing';
  const testPath = join(projectPath, 'src/test.scss');
  let tree: UnitTestTree;
  let writeFile: (filePath: string, text: string) => void;
  let runMigration: () => Promise<{ logOutput: string }>;

  beforeEach(async () => {
    const testSetup = await createTestCaseSetup('ng-add-migrate', collection, []);
    tree = testSetup.appTree;
    runMigration = testSetup.runFixers;
    writeFile = testSetup.writeFile;
  });

  /** Writes an array of lines as a single file. */
  function writeLines(path: string, lines: string[]): void {
    writeFile(path, lines.join('\n'));
  }

  /** Reads a file and split it into an array where each item is a new line. */
  function splitFile(path: string): string[] {
    return tree.readContent(path).split('\n');
  }

  /** Assert that file exists and parse json file to object */
  function readJsonFile(path: string) {
    if (!tree.exists(path)) {
      throw new SchematicsException(path + ' not found');
    }
    return JSON.parse(tree.read(path)!.toString('utf-8')) as any;
  }

  it('should migrate angular-(public|business) imports in angular.json to angular', async () => {
    const angularJson = readJsonFile('/angular.json');
    angularJson.projects['cdk-testing'].architect.build.options.styles.push(
      'node_modules/@sbb-esta/angular-public/typography.css'
    );
    angularJson.projects['cdk-testing'].architect.build.options.styles.push(
      'node_modules/@sbb-esta/angular-business/typography.css'
    );
    angularJson.projects['cdk-testing'].architect.test.options.styles.push(
      'node_modules/@sbb-esta/angular-business/typography.css'
    );
    angularJson.projects['cdk-testing'].architect.test.options.styles.push({
      input: 'node_modules/@sbb-esta/angular-business/typography.css',
      foo: 'bar',
    });
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await runMigration();

    const modifiedAngularJson = readJsonFile('/angular.json');
    expect(modifiedAngularJson.projects['cdk-testing'].architect.build.options.styles[1]).toBe(
      'node_modules/@sbb-esta/angular/typography.css'
    );
    expect(modifiedAngularJson.projects['cdk-testing'].architect.build.options.styles[2]).toBe(
      'node_modules/@sbb-esta/angular/typography.css'
    );
    expect(modifiedAngularJson.projects['cdk-testing'].architect.test.options.styles[1]).toBe(
      'node_modules/@sbb-esta/angular/typography.css'
    );
    expect(modifiedAngularJson.projects['cdk-testing'].architect.test.options.styles[2]).toEqual({
      input: 'node_modules/@sbb-esta/angular/typography.css',
      foo: 'bar',
    });
  });

  it('should migrate angular-(core|public|business) imports to angular', async () => {
    writeLines(testPath, [
      `@import '~@sbb-esta/angular-core/styles';`,
      `@import '@sbb-esta/angular-core/styles/common/variables';`,
      `@import "@sbb-esta/angular-public/styles/common/variables";`,
      `@import "@sbb-esta/angular-business/styles/common/variables";`,
      `@import "@sbb-esta/angular-core/_styles.scss";`,
      `@import "@sbb-esta/angular-public/_styles.scss";`,
      `@import "@sbb-esta/angular-business/_styles.scss";`,
      `@import "../node_modules/@sbb-esta/angular-core/styles/common/variables";`,
      `@import '~@sbb-esta/angular-public/styles.scss';`,
      `@import '@sbb-esta/angular-public/typography.css';`,
      `@import '@sbb-esta/angular-business/typography.css';`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@import '@sbb-esta/angular/styles';`,
      `@import '@sbb-esta/angular/styles';`,
      `@import "@sbb-esta/angular/styles";`,
      `@import "@sbb-esta/angular/styles";`,
      `@import "@sbb-esta/angular/styles";`,
      `@import "@sbb-esta/angular/styles";`,
      `@import "@sbb-esta/angular/styles";`,
      `@import "../node_modules/@sbb-esta/angular/styles";`,
      `@import '@sbb-esta/angular/styles';`,
      `@import '@sbb-esta/angular/typography.css';`,
      `@import '@sbb-esta/angular/typography.css';`,
    ]);
  });

  it('should remove the tilde from angular imports', async () => {
    writeLines(testPath, [
      `@use '~@sbb-esta/angular' as sbb;`,
      `@import '~@sbb-esta/angular/theming';`,
      `@import '~@sbb-esta/angular-maps/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@use '@sbb-esta/angular' as sbb;`,
      `@import '@sbb-esta/angular/theming';`,
      `@import '@sbb-esta/angular-maps/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);
  });

  it('should handle an arbitrary amount of whitespace', async () => {
    writeLines(testPath, [
      `@use                               '~@sbb-esta/angular' as sbb;`,

      `@include sbb.core();`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@use                               '@sbb-esta/angular' as sbb;`,

      `@include sbb.core();`,
    ]);
  });

  it('should preserve tilde after the start', async () => {
    writeLines(testPath, [
      `@use '~@sbb-esta/~angular' as sbb;`,
      `@import '@sbb-esta/angular-maps/~overlay-prebuilt.css';`,

      `@include sbb.core();`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@use '@sbb-esta/~angular' as sbb;`,
      `@import '@sbb-esta/angular-maps/~overlay-prebuilt.css';`,

      `@include sbb.core();`,
    ]);
  });

  it('should handle different types of quotes', async () => {
    writeLines(testPath, [
      `@use "~@sbb-esta/angular" as sbb;`,
      `@import '~@sbb-esta/angular-maps/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@use "@sbb-esta/angular" as sbb;`,
      `@import '@sbb-esta/angular-maps/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);
  });

  it('should preserve the tilde in non-angular imports', async () => {
    writeLines(testPath, [
      `@use '~@sbb-esta-momentum/angular' as sbb;`,
      `@import '~@sbb-esta-momentum/angular/theming';`,
      `@import '@sbb-esta/angular-maps/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@use '~@sbb-esta-momentum/angular' as sbb;`,
      `@import '~@sbb-esta-momentum/angular/theming';`,
      `@import '@sbb-esta/angular-maps/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);
  });

  it('should remove remove .scss file extension', async () => {
    writeLines(testPath, [
      `@use '~@sbb-esta/angular.scss' as sbb;`,
      `@import '~@sbb-esta/angular/theming.scss';`,
      `@import '~@sbb-esta/cdk/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);

    await runMigration();

    expect(splitFile(testPath)).toEqual([
      `@use '@sbb-esta/angular' as sbb;`,
      `@import '@sbb-esta/angular/theming';`,
      `@import '@sbb-esta/cdk/overlay-prebuilt.css';`,

      `@include sbb.button-theme();`,
      `@include sbb-core();`,
    ]);
  });
});
