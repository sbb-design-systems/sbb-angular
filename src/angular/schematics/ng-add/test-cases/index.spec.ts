import { getAllVersionNames } from '@angular/cdk/schematics';

import { COLLECTION_PATH, MIGRATION_PATH } from '../../index.spec';
import { defineJasmineTestCases, findBazelVersionTestCases } from '../../testing';

describe('@sbb-esta/angular add test cases', () => {
  const versionNames = getAllVersionNames().map((versionName) => versionName.toLowerCase());
  const testCasesMap = findBazelVersionTestCases(
    'sbb_angular/src/angular/schematics/ng-add/test-cases'
  );

  describe(`ng-add`, () => {
    defineJasmineTestCases('ng-add', COLLECTION_PATH, testCasesMap.get('merge'));
  });

  // Setup the test cases for each target version. The test cases will be automatically
  // detected through Bazel's runfiles manifest.
  versionNames.forEach((version) =>
    describe(`${version} update`, () => {
      defineJasmineTestCases(`migration-${version}`, MIGRATION_PATH, testCasesMap.get(version));
    })
  );
});
