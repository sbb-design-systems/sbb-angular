import { ElementSelectorUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const elementSelectors: VersionChanges<ElementSelectorUpgradeData> = {
  [TargetVersion.V14 as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'sbb-loading',
          replaceWith: 'sbb-loading-indicator',
        },
      ],
    },
  ],
};
