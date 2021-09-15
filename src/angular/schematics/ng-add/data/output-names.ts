import { OutputNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const outputNames: VersionChanges<OutputNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'afterDelete',
          replaceWith: 'removed',
          limitedTo: { elements: ['sbb-ghettobox'] },
        },
      ],
    },
  ],
};
