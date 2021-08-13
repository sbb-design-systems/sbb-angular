import {
  AttributeSelectorUpgradeData,
  TargetVersion,
  VersionChanges,
} from '@angular/cdk/schematics';

export const attributeSelectors: VersionChanges<AttributeSelectorUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'sbbDialogHeader',
          replaceWith: 'sbbDialogTitle',
        },
        {
          replace: 'sbbDialogFooter',
          replaceWith: 'sbbDialogActions',
        },
        {
          replace: 'sbbLightboxHeader',
          replaceWith: 'sbbLightboxTitle',
        },
        {
          replace: 'sbbLightboxFooter',
          replaceWith: 'sbbLightboxActions',
        },
        {
          replace: 'sbbSortHeader',
          replaceWith: 'sbb-sort-header',
        },
        {
          replace: 'sbbTable',
          replaceWith: 'sbb-table',
        },
        {
          replace: 'sbbHeaderRow',
          replaceWith: 'sbb-header-row',
        },
      ],
    },
  ],
};
