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
        {
          replace: 'SbbBusinessDateAdapter',
          replaceWith: 'SbbLeanDateAdapter',
        },
        {
          replace: 'SBB_BUSINESS_DATE_ADAPTER',
          replaceWith: 'SBB_LEAN_DATE_ADAPTER',
        },
        {
          replace: 'SbbChipModule',
          replaceWith: 'SbbChipsModule',
        },
        {
          replace: 'SbbChipInput',
          replaceWith: 'SbbChipList',
        },
        {
          replace: 'SbbChipInputChange',
          replaceWith: 'SbbChipInputEvent',
        },
        {
          replace: 'SbbPaginatorComponent',
          replaceWith: 'SbbPaginator',
        },
        {
          replace: 'SbbPageChangeEvent',
          replaceWith: 'SbbPageEvent',
        },
        {
          replace: 'SbbPagination',
          replaceWith: 'SbbPaginator',
        },
        {
          replace: 'SbbDialogHeader',
          replaceWith: 'SbbDialogTitle',
        },
        {
          replace: 'SbbDialogFooter',
          replaceWith: 'SbbDialogActions',
        },
        {
          replace: 'SbbLightboxHeader',
          replaceWith: 'SbbLightboxTitle',
        },
        {
          replace: 'SbbLightboxFooter',
          replaceWith: 'SbbLightboxActions',
        },
        {
          replace: 'SbbTabs',
          replaceWith: 'SbbTabGroup',
        },
        {
          replace: 'SbbProcessflowStep',
          replaceWith: 'SbbStep',
        },
        {
          replace: 'SbbFormFieldModule',
          replaceWith: 'SbbInputModule',
        },
        {
          replace: 'SbbGhettoboxContainer',
          replaceWith: 'SbbAlertOutlet',
        },
        {
          replace: 'SbbGhettobox',
          replaceWith: 'SbbAlert',
        },
        {
          replace: 'sbbGhettoboxAnimations',
          replaceWith: 'sbbAlertAnimations',
        },
        {
          replace: 'SbbGhettoboxConfig',
          replaceWith: 'SbbAlertConfig',
        },
        {
          replace: 'SbbGhettoboxEvent',
          replaceWith: 'SbbAlertEvent',
        },
        {
          replace: 'SbbGhettoboxModule',
          replaceWith: 'SbbAlertModule',
        },
        {
          replace: 'SbbGhettoboxRef',
          replaceWith: 'SbbAlertRef',
        },
        {
          replace: 'SbbGhettoboxRefConnector',
          replaceWith: 'SbbAlertRefConnector',
        },
        {
          replace: 'SbbGhettoboxService',
          replaceWith: 'SbbAlertService',
        },
        {
          replace: 'SbbGhettoboxState',
          replaceWith: 'SbbAlertState',
        },
        {
          replace: 'SbbTooltipComponent',
          replaceWith: 'SbbTooltipWrapper',
        },
        {
          replace: 'SbbSortHeaderComponent',
          replaceWith: 'SbbSortHeader',
        },
        {
          replace: 'SbbSort',
          replaceWith: 'SbbSortState',
        },
        {
          replace: 'SbbSortDirective',
          replaceWith: 'SbbSort',
        },
        {
          replace: 'NotificationType',
          replaceWith: 'SbbNotificationType',
        },
        {
          replace: 'SbbNotificationVerticalPosition',
          replaceWith: 'SbbNotificationToastVerticalPosition',
        },
        {
          replace: 'SbbUsermenuItem',
          replaceWith: 'SbbMenuItem',
        },
        {
          replace: 'SbbHeaderModule',
          replaceWith: 'SbbHeaderLeanModule',
        },
      ],
    },
  ],
};
