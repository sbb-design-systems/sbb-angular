import {
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  HostBinding,
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { HOME, END } from '@angular/cdk/keycodes';

import { IAccordionBase, SBB_ACCORDION } from './accordion-base';
import { ExpansionPanelHeaderComponent } from '../expansion-panel-header/expansion-panel-header.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';


@Component({
  selector: 'sbb-accordion',
  exportAs: 'sbbAccordion',
  providers: [{
    provide: SBB_ACCORDION,
    useExisting: AccordionComponent
  }],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent extends CdkAccordion implements IAccordionBase, AfterContentInit {
  private _keyManager: FocusKeyManager<ExpansionPanelHeaderComponent>;

  @Input() multi = true;

  @ContentChildren(ExpansionPanelHeaderComponent, { descendants: true })
  headers: QueryList<ExpansionPanelHeaderComponent>;

  /** Whether the expansion indicator should be hidden. */
  @Input()
  get hideToggle(): boolean { return this._hideToggle; }
  set hideToggle(show: boolean) { this._hideToggle = coerceBooleanProperty(show); }
  private _hideToggle = false;

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

  handleHeaderFocus(header: ExpansionPanelHeaderComponent) {
    this._keyManager.updateActiveItem(header);
  }
}
