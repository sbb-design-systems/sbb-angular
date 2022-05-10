import { ClassNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const classNames: VersionChanges<ClassNameUpgradeData> = {
  [TargetVersion.V14 as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'SbbLoading',
          replaceWith: 'SbbLoadingIndicator',
        },
        {
          replace: 'SbbLoadingModule',
          replaceWith: 'SbbLoadingIndicatorModule',
        },
        {
          replace: 'SbbLoadingMode',
          replaceWith: 'SbbLoadingIndicatorMode',
        },
      ],
    },
  ],
};
