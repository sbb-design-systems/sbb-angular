import { PropertyNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const propertyNames: VersionChanges<PropertyNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'getFileTypeCategoryByMimeType',
          replaceWith: 'resolveFileTypeCategoryByMimeType',
          limitedTo: {
            classes: ['SbbFileSelectorTypesService'],
          },
        },
        {
          replace: 'getAcceptString',
          replaceWith: 'resolveAcceptString',
          limitedTo: {
            classes: ['SbbFileSelectorTypesService'],
          },
        },
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
