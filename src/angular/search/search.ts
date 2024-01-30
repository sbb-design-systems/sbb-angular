import { ENTER } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SbbAutocompleteOrigin, SbbAutocompleteTrigger } from '@sbb-esta/angular/autocomplete';
import { TypeRef } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { SbbInput } from '@sbb-esta/angular/input';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { getSbbInputRequiredError } from './search-error';

let nextId = 1;

@Component({
  selector: 'sbb-search',
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
  exportAs: 'sbbSearch',
  host: {
    class: 'sbb-search',
    '[attr.id]': 'this.id',
    '[class.sbb-focused]': 'focused',
    '[class.sbb-autocomplete-panel-open]': '_autocompleteTrigger?.panelOpen',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SbbIcon],
})
export class SbbSearch implements AfterContentInit, OnDestroy {
  /** The autocomplete trigger optionally contained in the search element. */
  @ContentChild(SbbAutocompleteTrigger, { static: true })
  _autocompleteTrigger?: SbbAutocompleteTrigger;

  /** The nested form control. */
  @ContentChild(SbbInput, { static: true }) _input!: SbbInput;

  /** Identifier of search. */
  @Input() id: string = `sbb-search-id-${nextId++}`;

  /**
   * The indicator icon, which will be used in the button.
   *
   * e.g. svgIcon="magnifying-glass-small"
   */
  @Input() svgIcon: string = 'magnifying-glass-small';

  /** Type of the search button. Defaults to "button" if not specified. */
  @Input() type: string = 'button';

  /** aria-label for the search button. */
  @Input('aria-label') ariaLabel: string;

  /** aria-labelledby for the search button. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** aria-describedby for the search button. */
  @Input('aria-describedby') ariaDescribedby: string;

  /**
   * Event emitted when either the ENTER key is pressed on the input field,
   * the search button is clicked or an autocomplete option is selected.
   */
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  get disabled() {
    return this._input?.disabled ?? false;
  }

  /** Whether the search is focused. */
  get focused(): boolean {
    return this._focused || !!this._autocompleteTrigger?.panelOpen;
  }
  private _focused = false;

  private _destroyed = new Subject<void>();

  constructor(private _elementRef: ElementRef<HTMLInputElement>) {}

  ngAfterContentInit(): void {
    if (!this._input && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSbbInputRequiredError();
    }
    if (this._autocompleteTrigger) {
      this._autocompleteTrigger.connectedTo = new SbbAutocompleteOrigin(this._elementRef);
      this._autocompleteTrigger.autocomplete.optionSelected
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._emitSearch());
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** When the input inside receives focus, we update the focus state. */
  @HostListener('focusin')
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
    }
  }

  /** When the input inside loses focus, we update the focus state. */
  @HostListener('focusout')
  _onBlur() {
    if (!this._autocompleteTrigger || !this._autocompleteTrigger.panelOpen) {
      this._focused = false;
    } else if (this._autocompleteTrigger) {
      this._autocompleteTrigger.autocomplete.closed
        .pipe(take(1))
        .subscribe(() => (this._focused = false));
    }
  }

  @HostListener('keydown', ['$event'])
  _keydown(event: TypeRef<KeyboardEvent>) {
    const keyCode = event.keyCode;
    if (keyCode === ENTER) {
      this._emitSearch();
    }
  }

  /** Called whenever the current value should be emitted. */
  _emitSearch() {
    this.search.emit(this._input.value);
    this._autocompleteTrigger?.closePanel();
  }
}
