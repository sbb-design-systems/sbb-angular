import { ENTER } from '@angular/cdk/keycodes';
import { InjectionToken } from '@angular/core';

/** Default options, for the chips module, that can be overridden. */
export interface SbbChipsDefaultOptions {
  /** The list of key codes that will trigger a chipEnd event. */
  separatorKeyCodes: readonly number[] | ReadonlySet<number>;
}

/** Injection token to be used to override the default options for the chips module. */
export const SBB_CHIPS_DEFAULT_OPTIONS = new InjectionToken<SbbChipsDefaultOptions>(
  'sbb-chips-default-options',
  {
    providedIn: 'root',
    factory: () => ({
      separatorKeyCodes: [ENTER],
    }),
  },
);
