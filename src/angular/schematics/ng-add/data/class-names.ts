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
        {
          replace: 'SbbContextmenuModule',
          replaceWith: 'SbbMenuModule',
        },
        {
          replace: 'SbbDropdown',
          replaceWith: 'SbbMenu',
        },
        {
          replace: 'SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER',
          replaceWith: 'SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER',
        },
        {
          replace: 'SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY',
          replaceWith: 'SBB_MENU_SCROLL_STRATEGY_FACTORY',
        },
        {
          replace: 'SBB_DROPDOWN_SCROLL_STRATEGY',
          replaceWith: 'SBB_MENU_SCROLL_STRATEGY',
        },
        {
          replace: 'SbbDropdownTrigger',
          replaceWith: 'SbbMenuTrigger',
        },
        {
          replace: 'SbbDropdownItem',
          replaceWith: 'SbbMenuItem',
        },
        {
          replace: 'SbbDropdownModule',
          replaceWith: 'SbbMenuModule',
        },
        {
          replace: 'SbbDropdownDefaultOptions',
          replaceWith: 'SbbMenuDefaultOptions',
        },
      ],
    },
  ],
};
