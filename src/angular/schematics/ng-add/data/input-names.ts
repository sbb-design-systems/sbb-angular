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
        {
          replace: 'title',
          replaceWith: 'label',
          limitedTo: { elements: ['sbb-processflow-step', 'sbb-step'] },
        },
        {
          replace: 'i18n-title',
          replaceWith: 'i18n-label',
          limitedTo: { elements: ['sbb-processflow-step', 'sbb-step'] },
        },
        {
          replace: 'i18n-label',
          replaceWith: 'i18n',
          limitedTo: { elements: ['sbb-tag', 'sbb-checkbox-panel', 'sbb-radio-button-panel'] },
        },
        {
          replace: 'infoText',
          replaceWith: 'subtitle',
          limitedTo: { elements: ['sbb-toggle-option'] },
        },
        {
          replace: 'i18n-infoText',
          replaceWith: 'i18n-subtitle',
          limitedTo: { elements: ['sbb-toggle-option'] },
        },
      ],
    },
  ],
};
