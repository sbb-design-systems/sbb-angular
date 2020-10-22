import { PropertyNameUpgradeData, TargetVersion, VersionChanges } from '@angular/cdk/schematics';

export const propertyNames: VersionChanges<PropertyNameUpgradeData> = {
  [TargetVersion.V11]: [
    {
      pr: '',
      changes: [
        {
          replace: 'openSelect',
          replaceWith: 'open',
          whitelist: { classes: ['SbbSelect'] },
        },
        {
          replace: 'openDialog',
          replaceWith: 'open',
          whitelist: { classes: ['SbbDialog'] },
        },
        {
          replace: 'openLightbox',
          replaceWith: 'open',
          whitelist: { classes: ['SbbLightbox'] },
        },
        {
          replace: 'openTooltip',
          replaceWith: 'open',
          whitelist: { classes: ['SbbTooltipBase', 'SbbTooltip', 'SbbTooltipComponent'] },
        },
        {
          replace: 'open',
          replaceWith: 'open',
          whitelist: { classes: ['SbbTooltipBase', 'SbbTooltip', 'SbbTooltipComponent'] },
        },
        {
          replace: 'open',
          replaceWith: 'isOpen',
          whitelist: { classes: ['SbbAutocomplete'] },
        },
        {
          replace: 'master',
          replaceWith: 'main',
          whitelist: { classes: ['SbbDatepicker'] },
        },
        {
          replace: 'slave',
          replaceWith: 'connected',
          whitelist: { classes: ['SbbDatepicker'] },
        },
      ],
    },
  ],
};
