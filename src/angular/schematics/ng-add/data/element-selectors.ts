import { ElementSelectorUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const elementSelectors: VersionChanges<ElementSelectorUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'sbb-option-group',
          replaceWith: 'sbb-optgroup',
        },
        {
          replace: 'sbb-dropdown',
          replaceWith: 'sbb-menu',
        },
        {
          replace: 'sbb-chip-input',
          replaceWith: 'sbb-chip-list',
        },
        {
          replace: 'sbb-pagination',
          replaceWith: 'sbb-paginator',
        },
        {
          replace: 'sbb-dialog-header',
          replaceWith: 'sbb-dialog-title',
        },
        {
          replace: 'sbb-dialog-footer',
          replaceWith: 'sbb-dialog-actions',
        },
        {
          replace: 'sbb-lightbox-header',
          replaceWith: 'sbb-lightbox-title',
        },
        {
          replace: 'sbb-lightbox-footer',
          replaceWith: 'sbb-lightbox-actions',
        },
        {
          replace: 'sbb-tabs',
          replaceWith: 'sbb-tab-group',
        },
        {
          replace: 'sbb-processflow-step',
          replaceWith: 'sbb-step',
        },
      ],
    },
  ],
};
