import { UnitTestTree } from '@angular-devkit/schematics/testing';
import {
  TEST_TS_LEAN_CONFIG,
  TEST_TS_LEAN_CONFIG_COMMAND,
  TEST_TS_LEAN_CONFIG_COMMENT,
} from '@sbb-esta/angular/schematics/ng-add/setup-project';
import { join } from 'path';

import { MIGRATION_PATH } from '../../paths';
import { createTestCaseSetup } from '../../testing';

describe('v13 lean test configuration migration', () => {
  const projectPath = '/projects/cdk-testing';
  const indexHtmlPath = join(projectPath, 'src/index.html');
  const testTsPath = join(projectPath, 'src/test.ts');

  let tree: UnitTestTree;
  let writeFile: (filePath: string, text: string) => void;
  let runMigration: () => Promise<{ logOutput: string }>;

  beforeEach(async () => {
    const testSetup = await createTestCaseSetup('migration-v13', MIGRATION_PATH, []);
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
    return readFile(path).split('\n');
  }

  /** Reads a file */
  function readFile(path: string): string {
    return tree.readContent(path);
  }

  it('should set lean configuration in test.ts', async () => {
    writeLines(indexHtmlPath, [`<html class="sbb-lean"></html>`]);

    await runMigration();

    expect(splitFile(testTsPath)[26]).toEqual(TEST_TS_LEAN_CONFIG_COMMENT);
    expect(splitFile(testTsPath)[27]).toEqual(TEST_TS_LEAN_CONFIG_COMMAND);
  });

  it('should do nothing if lean configuration in test.ts was set', async () => {
    writeLines(indexHtmlPath, [`<html class="sbb-lean"></html>`]);
    writeLines(testTsPath, [TEST_TS_LEAN_CONFIG]);
    expect(readFile(testTsPath).match(/sbb-lean/g)!.length).toBe(2);

    await runMigration();

    expect(readFile(testTsPath).match(/sbb-lean/g)!.length).toBe(2);
  });

  it('should not set lean configuration in test.ts when standard configuration is active', async () => {
    await runMigration();

    expect(readFile(testTsPath).match(/sbb-lean/g)).toBeFalsy();
  });
});
