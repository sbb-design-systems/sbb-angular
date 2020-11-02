import { PropertyNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const propertyNames: VersionChanges<PropertyNameUpgradeData> = {
  [TargetVersion.V11]: [
    {
      pr: '',
      changes: [
        {
          replace: 'openSelect',
          replaceWith: 'open',
          limitedTo: { classes: ['SbbSelect'] },
        },
        {
          replace: 'openDialog',
          replaceWith: 'open',
          limitedTo: { classes: ['SbbDialog'] },
        },
        {
          replace: 'openLightbox',
          replaceWith: 'open',
          limitedTo: { classes: ['SbbLightbox'] },
        },
        {
          replace: 'openTooltip',
          replaceWith: 'open',
          limitedTo: { classes: ['SbbTooltipBase', 'SbbTooltip', 'SbbTooltipComponent'] },
        },
        {
          replace: 'open',
          replaceWith: 'isOpen',
          limitedTo: { classes: ['SbbAutocomplete'] },
        },
        {
          replace: 'master',
          replaceWith: 'main',
          limitedTo: { classes: ['SbbDatepicker'] },
        },
        {
          replace: 'slave',
          replaceWith: 'connected',
          limitedTo: { classes: ['SbbDatepicker'] },
        },
        {
          replace: 'isDisabled',
          replaceWith: 'disabled',
          limitedTo: { classes: ['SbbDateInput'] },
        },
      ],
    },
  ],
};
