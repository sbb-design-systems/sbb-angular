/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { HOME, END } from '@angular/cdk/keycodes';



import { SBB_ACCORDION, SbbAccordionBase, SbbAccordionDisplayMode } from './accordion-base';
import { SbbExpansionPanelHeader } from '../accordion-header/accordion-header.component';

/**
 * Directive for a Material Design Accordion.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'sbb-accordion',
  exportAs: 'sbbAccordion',
  // tslint:disable-next-line:use-input-property-decorator
  inputs: ['multi'],
  providers: [{
    provide: SBB_ACCORDION,
    useExisting: AccordionDirective
  }],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'sbb-accordion'
  }
})
export class AccordionDirective extends CdkAccordion implements SbbAccordionBase, AfterContentInit {
  private _keyManager: FocusKeyManager<SbbExpansionPanelHeader>;

  @ContentChildren(SbbExpansionPanelHeader, { descendants: true })
  _headers: QueryList<SbbExpansionPanelHeader>;

  /** Whether the expansion indicator should be hidden. */
  @Input()
  get hideToggle(): boolean { return this._hideToggle; }
  set hideToggle(show: boolean) { this._hideToggle = coerceBooleanProperty(show); }
  private _hideToggle = false;

  /**
   * Display mode used for all expansion panels in the accordion. Currently two display
   * modes exist:
   *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
   *     panel at a different elevation from the rest of the accordion.
   *  flat - no spacing is placed around expanded panels, showing all panels at the same
   *     elevation.
   */
  @Input() displayMode: SbbAccordionDisplayMode = 'default';

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager(this._headers).withWrap();
  }

  /** Handles keyboard events coming in from the panel headers. */
  _handleHeaderKeydown(event: KeyboardEvent) {
    const { keyCode } = event;
    const manager = this._keyManager;

    if (keyCode === HOME) {
      manager.setFirstItemActive();
      event.preventDefault();
    } else if (keyCode === END) {
      manager.setLastItemActive();
      event.preventDefault();
    } else {
      this._keyManager.onKeydown(event);
    }
  }

  _handleHeaderFocus(header: SbbExpansionPanelHeader) {
    this._keyManager.updateActiveItem(header);
  }
}
