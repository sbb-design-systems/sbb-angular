import { InjectionToken } from '@angular/core';

/**
 * Describes a parent component that manages a list of toggle options.
 * Contains properties that the options can inherit.
 * @deprecated
 * @docs-private
 */
export interface ToggleBase {
  formControlName: string;
  name: string;
  inputId: string;
}

/**
 * Injection token used to provide the parent component to toggle options.
 * @deprecated
 */
export const SBB_TOGGLE_COMPONENT = new InjectionToken<ToggleBase>('SBB_TOGGLE_COMPONENT');
