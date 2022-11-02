import { ClassNameUpgradeData, VersionChanges } from '@angular/cdk/schematics';

import { TargetVersion } from '../target-version';

export const classNames: VersionChanges<ClassNameUpgradeData> = {
  [TargetVersion.V14 as string]: [
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
