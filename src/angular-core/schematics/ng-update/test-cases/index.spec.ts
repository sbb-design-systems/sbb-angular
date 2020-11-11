import {
  defineJasmineTestCases,
  findBazelVersionTestCases,
} from '@sbb-esta/angular-core/schematics/testing';
import { getAllVersionNames } from '@angular/cdk/schematics';
import { MIGRATION_PATH } from '../../index.spec';

describe('@sbb-esta/angular-core upgrade test cases', () => {
  const versionNames = getAllVersionNames().map((versionName) => versionName.toLowerCase());
  const testCasesMap = findBazelVersionTestCases(
    'sbb_angular/src/angular-core/schematics/ng-update/test-cases'
  );

  // Setup the test cases for each target version. The test cases will be automatically
  // detected through Bazel's runfiles manifest.
  versionNames.forEach((version) =>
    describe(`${version} update`, () => {
      defineJasmineTestCases(version, MIGRATION_PATH, testCasesMap.get(version));
    })
  );
});
