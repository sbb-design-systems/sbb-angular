import { InjectionToken } from '@angular/core';

/** Object that can be used to configure the default options for the tabs module. */
export interface SbbTabsConfig {
  /** Duration for the tab animation. Must be a valid CSS value (e.g. 600ms). */
  animationDuration?: string;

  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   * This applies only for lean design.
   */
  disablePagination?: boolean;

  /** Whether the tab group should grow to the size of the active tab. */
  dynamicHeight?: boolean;

  /**
   * By default tabs remove their content from the DOM while it's off-screen.
   * Setting this to `true` will keep it in the DOM which will prevent elements
   * like iframes and videos from reloading next time it comes back into the view.
   */
  preserveContent?: boolean;
}

/** Injection token that can be used to provide the default options the tabs module. */
export const SBB_TABS_CONFIG = new InjectionToken<SbbTabsConfig>('SBB_TABS_CONFIG');
