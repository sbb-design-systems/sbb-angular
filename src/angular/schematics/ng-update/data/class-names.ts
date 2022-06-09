import { ClassNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const classNames: VersionChanges<ClassNameUpgradeData> = {
  [TargetVersion.V14]: [
    {
      pr: '',
      changes: [
        {
          replace: 'SbbLoadingModule',
          replaceWith: 'SbbLoadingIndicatorModule',
        },
        {
          replace: 'SbbLoadingMode',
          replaceWith: 'SbbLoadingIndicatorMode',
        },
        {
          replace: 'SbbLoading',
          replaceWith: 'SbbLoadingIndicator',
        },
        {
          replace: 'SbbAutocompleteHint',
          replaceWith: 'SbbOptionHint',
        },
      ],
    },
  ],
};
