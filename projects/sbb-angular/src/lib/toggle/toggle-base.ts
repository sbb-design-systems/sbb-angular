import { InjectionToken, QueryList } from '@angular/core';
import { ToggleOptionComponent } from './toggle-option/toggle-option.component';

/**
 * Describes a parent component that manages a list of toggle options.
 * Contains properties that the options can inherit.
 * @docs-private
 */
export interface ToggleBase {
  toggleOptions: QueryList<ToggleOptionComponent>;
}

/**
 * Injection token used to provide the parent component to toggle options.
 */
export const SBB_TOGGLE_COMPONENT = new InjectionToken<ToggleBase>('TOGGLE_COMPONENT');
