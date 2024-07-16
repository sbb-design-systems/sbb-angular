import { Component, Input } from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';

import { SbbMenuDynamicTrigger } from './menu-dynamic-trigger';
import {
  SbbMenuInheritedTriggerContext,
  SbbMenuTrigger,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from './menu-trigger';

export const _sbbContextmenuInheritedTriggerContext: SbbMenuInheritedTriggerContext = {
  type: 'contextmenu',
  xPosition: 'before',
};

/** Directive applied to an element that should trigger a `sbb-menu`. */
@Component({
  template: '<sbb-icon *sbbMenuDynamicTrigger [svgIcon]="svgIcon"></sbb-icon>',
  selector: `button[sbbContextmenuTriggerFor]`,
  inputs: ['menu: sbbContextmenuTriggerFor'],
  exportAs: 'sbbContextmenuTrigger',
  providers: [
    {
      provide: SBB_MENU_INHERITED_TRIGGER_CONTEXT,
      useValue: _sbbContextmenuInheritedTriggerContext,
    },
    {
      provide: SbbMenuTrigger,
      useExisting: SbbContextmenuTrigger,
    },
  ],
  standalone: true,
  imports: [SbbMenuDynamicTrigger, SbbIcon],
})
export class SbbContextmenuTrigger extends SbbMenuTrigger {
  /**
   * Custom trigger icon.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="plus-small"
   */
  @Input() svgIcon: string = 'context-menu-small';
}
