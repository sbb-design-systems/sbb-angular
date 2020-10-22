import { FocusKeyManager } from '@angular/cdk/a11y';
import { CdkAccordion } from '@angular/cdk/accordion';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { END, HOME } from '@angular/cdk/keycodes';
import { AfterContentInit, ContentChildren, Directive, Input, QueryList } from '@angular/core';

import { SbbExpansionPanelHeader } from '../expansion-panel-header/expansion-panel-header.component';

import { SBB_ACCORDION } from './accordion-token';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'sbb-accordion',
  exportAs: 'sbbAccordion',
  providers: [
    {
      provide: SBB_ACCORDION,
      useExisting: SbbAccordion,
    },
  ],
  host: {
    class: 'sbb-accordion',
  },
})
export class SbbAccordion extends CdkAccordion implements AfterContentInit {
  private _keyManager: FocusKeyManager<SbbExpansionPanelHeader>;
  /** Class property that refers to the headers of the panels of the accordion. */
  @ContentChildren(SbbExpansionPanelHeader, { descendants: true })
  headers: QueryList<SbbExpansionPanelHeader>;

  /** Whether the expansion indicator should be hidden. */
  @Input()
  get hideToggle(): boolean {
    return this._hideToggle;
  }
  set hideToggle(show: boolean) {
    this._hideToggle = coerceBooleanProperty(show);
  }
  private _hideToggle = false;

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager(this.headers).withWrap();
  }

  /** Handles keyboard events coming in from the panel headers. */
  handleHeaderKeydown(event: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
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
  /** Handles a event coming on a header of a panel associated at a specific item. */
  handleHeaderFocus(header: SbbExpansionPanelHeader) {
    this._keyManager.updateActiveItem(header);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_hideToggle: BooleanInput;
  // tslint:enable: member-ordering
}
