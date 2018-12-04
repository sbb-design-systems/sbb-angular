import { Directive, Input, ContentChildren, QueryList, AfterContentInit, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { HOME, END } from '@angular/cdk/keycodes';

import { SBB_ACCORDION, AccordionBase } from './accordion-base';
import { AccordionPanelHeader } from '../accordion-header/accordion-header.component';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'sbb-accordion',
  exportAs: 'sbbAccordion',
  providers: [{
    provide: SBB_ACCORDION,
    useExisting: AccordionDirective
  }]
})
export class AccordionDirective extends CdkAccordion implements AccordionBase, AfterContentInit {
  private _keyManager: FocusKeyManager<AccordionPanelHeader>;

  @ContentChildren(AccordionPanelHeader, { descendants: true })
  headers: QueryList<AccordionPanelHeader>;

  @Input() multi = true;

  @HostBinding('class.sbb-accordion') sbbAccordionClass = true;

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager(this.headers).withWrap();
  }

  /** Handles keyboard events coming in from the panel headers. */
  handleHeaderKeydown(event: KeyboardEvent) {
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

  handleHeaderFocus(header: AccordionPanelHeader) {
    this._keyManager.updateActiveItem(header);
  }
}
