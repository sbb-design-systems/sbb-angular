import { PropertyNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const propertyNames: VersionChanges<PropertyNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'getFileExtensionFromFileName',
          replaceWith: 'fileExtension',
          limitedTo: {
            classes: ['SbbFileSelectorTypesService'],
          },
        },
        {
          replace: 'getFileNameNoExtension',
          replaceWith: 'removeFileExtension',
          limitedTo: {
            classes: ['SbbFileSelectorTypesService'],
          },
        },
        {
          replace: 'prevStep',
          replaceWith: 'previous',
          limitedTo: {
            classes: ['SbbProcessflow'],
          },
        },
        {
          replace: 'nextStep',
          replaceWith: 'next',
          limitedTo: {
            classes: ['SbbProcessflow'],
          },
        },
        {
          replace: 'manualCloseAction',
          replaceWith: 'closeRequest',
          limitedTo: {
            classes: ['SbbLightboxRef'],
          },
        },
        {
          replace: 'infoText',
          replaceWith: 'subtitle',
          limitedTo: {
            classes: ['SbbToggleOption'],
          },
        },
        {
          replace: 'containerReady',
          replaceWith: 'outletReady',
          limitedTo: {
            classes: ['SbbGhettoboxService', 'SbbAlertService'],
          },
        },
        {
          replace: 'createGhettobox',
          replaceWith: 'createAlert',
          limitedTo: {
            classes: ['SbbGhettoboxContainer', 'SbbAlertOutlet'],
          },
        },
        {
          replace: 'open',
          replaceWith: 'show',
          limitedTo: {
            classes: ['SbbTooltipWrapper', 'SbbTooltipComponent'],
          },
        },
        {
          replace: 'close',
          replaceWith: 'hide',
          limitedTo: {
            classes: ['SbbTooltipWrapper', 'SbbTooltipComponent'],
          },
        },
        {
          replace: 'sbbSortChange',
          replaceWith: 'sortChange',
          limitedTo: {
            classes: ['SbbSortDirective', 'SbbSort'],
          },
        },
      ],
    },
  ],
};
