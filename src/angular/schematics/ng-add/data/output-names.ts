import { OutputNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const outputNames: VersionChanges<OutputNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'afterDelete',
          replaceWith: 'dismissed',
          limitedTo: { elements: ['sbb-ghettobox', 'sbb-alert'] },
        },
      ],
    },
  ],
};
