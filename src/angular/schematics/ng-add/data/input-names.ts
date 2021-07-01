import { InputNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const inputNames: VersionChanges<InputNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'alignment',
          replaceWith: 'align',
          limitedTo: {
            elements: ['sbb-dialog-footer', 'sbb-dialog-actions'],
            attributes: ['sbbDialogFooter', 'sbbDialogActions'],
          },
        },
      ],
    },
  ],
};
