import { ElementSelectorUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const elementSelectors: VersionChanges<ElementSelectorUpgradeData> = {
  [TargetVersion.V11]: [
    {
      pr: '',
      changes: [{ replace: 'sbb-form-error', replaceWith: 'sbb-error' }],
    },
  ],
};
