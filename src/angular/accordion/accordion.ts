import { FocusKeyManager } from '@angular/cdk/a11y';
import { CdkAccordion } from '@angular/cdk/accordion';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { startWith } from 'rxjs/operators';

import { SBB_ACCORDION } from './accordion-token';
import { SbbExpansionPanelHeader } from './expansion-panel-header';

@Directive({
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
  standalone: true,
})
export class SbbAccordion extends CdkAccordion implements AfterContentInit, OnDestroy {
  private _keyManager: FocusKeyManager<SbbExpansionPanelHeader>;

  /** Headers belonging to this accordion. */
  private _ownHeaders = new QueryList<SbbExpansionPanelHeader>();

  /** All headers inside the accordion. Includes headers inside nested accordions. */
  @ContentChildren(SbbExpansionPanelHeader, { descendants: true })
  _headers: QueryList<SbbExpansionPanelHeader>;

  /** Whether the expansion indicator should be hidden. */
  @Input()
  get hideToggle(): boolean {
    return this._hideToggle;
  }
  set hideToggle(show: BooleanInput) {
    this._hideToggle = coerceBooleanProperty(show);
  }
  private _hideToggle: boolean = false;

  ngAfterContentInit() {
    this._headers.changes
      .pipe(startWith(this._headers))
      .subscribe((headers: QueryList<SbbExpansionPanelHeader>) => {
        this._ownHeaders.reset(headers.filter((header) => header.panel.accordion === this));
        this._ownHeaders.notifyOnChanges();
      });

    this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap().withHomeAndEnd();
  }

  /** Handles keyboard events coming in from the panel headers. */
  _handleHeaderKeydown(event: KeyboardEvent) {
    this._keyManager.onKeydown(event);
  }

  _handleHeaderFocus(header: SbbExpansionPanelHeader) {
    this._keyManager.updateActiveItem(header);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._keyManager?.destroy();
    this._ownHeaders.destroy();
  }
}
