import { COLLECTION_PATH } from '../../index.spec';
import { defineJasmineTestCases, findBazelVersionTestCases } from '../../testing';

describe('@sbb-esta/angular ng-add test cases', () => {
  const testCasesMap = findBazelVersionTestCases(
    'sbb_angular/src/angular/schematics/ng-add/test-cases'
  );

  describe(`ng-add-migrate`, () => {
    defineJasmineTestCases(
      ['ng-add-migrate', 'ng-migration-clean-up'],
      COLLECTION_PATH,
      testCasesMap.get('merge')
    );
  });
});
