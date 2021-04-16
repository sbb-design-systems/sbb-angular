import { InjectionToken } from '@angular/core';

/** Object that can be used to configure the default options for the tabs module. */
export interface SbbTabsConfig {
  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  disablePagination?: boolean;

  /** Whether the tab group should grow to the size of the active tab. */
  dynamicHeight?: boolean;
}

/** Injection token that can be used to provide the default options the tabs module. */
export const SBB_TABS_CONFIG = new InjectionToken<SbbTabsConfig>('SBB_TABS_CONFIG');
