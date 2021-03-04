import { ClassNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const classNames: VersionChanges<ClassNameUpgradeData> = {
  ['merge' as TargetVersion]: [
    {
      pr: '',
      changes: [
        {
          replace: 'SbbOptionGroup',
          replaceWith: 'SbbOptgroup',
        },
        {
          replace: 'SbbLink',
          replaceWith: 'SbbAnchor',
        },
        {
          replace: 'SbbLinksModule',
          replaceWith: 'SbbButtonModule',
        },
      ],
    },
  ],
};
