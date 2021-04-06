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
      ],
    },
  ],
};
