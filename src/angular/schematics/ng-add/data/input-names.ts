import { InputNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const inputNames: VersionChanges<InputNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [],
    },
  ],
};
