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
      ],
    },
  ],
};
