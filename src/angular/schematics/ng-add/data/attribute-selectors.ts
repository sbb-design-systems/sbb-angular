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
      ],
    },
  ],
};
