import { ElementSelectorUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const elementSelectors: VersionChanges<ElementSelectorUpgradeData> = {
  [TargetVersion.V14]: [
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
