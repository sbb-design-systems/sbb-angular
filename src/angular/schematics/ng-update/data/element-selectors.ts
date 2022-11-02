import { ElementSelectorUpgradeData, VersionChanges } from '@angular/cdk/schematics';

import { TargetVersion } from '../target-version';

export const elementSelectors: VersionChanges<ElementSelectorUpgradeData> = {
  [TargetVersion.V14 as string]: [
    {
      pr: '',
      changes: [
        {
          replace: 'sbb-loading',
          replaceWith: 'sbb-loading-indicator',
        },
        {
          replace: 'sbb-autocomplete-hint',
          replaceWith: 'sbb-option-hint',
        },
        {
          replace: 'sbb-icon-button',
          replaceWith: 'sbb-secondary-button',
        },
      ],
    },
  ],
};
