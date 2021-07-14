import { InjectionToken } from '@angular/core';

/** Default `sbb-checkbox` options that can be overridden. */
export interface SbbCheckboxDefaultOptions {
  clickAction?: SbbCheckboxClickAction;
}

/** Injection token to be used to override the default options for `sbb-checkbox`. */
export const SBB_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken<SbbCheckboxDefaultOptions>(
  'sbb-checkbox-default-options',
  {
    providedIn: 'root',
    factory: SBB_CHECKBOX_DEFAULT_OPTIONS_FACTORY,
  }
);

/** @docs-private */
export function SBB_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): SbbCheckboxDefaultOptions {
  return {
    clickAction: 'check-indeterminate',
  };
}

/**
 * Checkbox click action when user click on input element.
 * noop: Do not toggle checked or indeterminate.
 * check: Only toggle checked status, ignore indeterminate.
 * check-indeterminate: Toggle checked status, set indeterminate to false. Default behavior.
 * undefined: Same as `check-indeterminate`.
 */
export type SbbCheckboxClickAction = 'noop' | 'check' | 'check-indeterminate' | undefined;
