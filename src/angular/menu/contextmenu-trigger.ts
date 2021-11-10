import { Component, Input } from '@angular/core';

import {
  SbbMenuInheritedTriggerContext,
  SbbMenuTrigger,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from './menu-trigger';

// tslint:disable-next-line:naming-convention
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
})
export class SbbContextmenuTrigger extends SbbMenuTrigger {
  /**
   * Custom trigger icon.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="kom:plus-small"
   */
  @Input() svgIcon: string = 'kom:context-menu-small';
}
