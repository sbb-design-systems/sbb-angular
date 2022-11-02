import { ConstructorChecksUpgradeData, VersionChanges } from '@angular/cdk/schematics';

import { TargetVersion } from '../target-version';

/**
 * List of class names for which the constructor signature has been changed. The new constructor
 * signature types don't need to be stored here because the signature will be determined
 * automatically through type checking.
 */
export const constructorChecks: VersionChanges<ConstructorChecksUpgradeData> = {
  [TargetVersion.V14 as string]: [
    {
      pr: '',
      changes: ['SbbMenuItem'],
    },
    {
      pr: '',
      changes: ['SbbAnchor'],
    },
    {
      pr: '',
      changes: ['SbbDatepicker'],
    },
  ],
};
