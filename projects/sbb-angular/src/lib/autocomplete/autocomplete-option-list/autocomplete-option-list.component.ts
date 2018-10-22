import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  AfterContentInit,
  ChangeDetectorRef,
  Input,
  QueryList,
  ContentChildren,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { AutocompleteOptionComponent, AutocompleteOptionSelectionChange } from '../autocomplete-option/autocomplete-option.component';

export class SbbAutocompleteSelectedEvent {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: AutocompleteOptionListComponent,
    /** Option that was selected. */
    public option: AutocompleteOptionComponent) { }
}

@Component({
  selector: 'sbb-autocomplete-option-list',
  templateUrl: './autocomplete-option-list.component.html',
  styleUrls: ['./autocomplete-option-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteOptionListComponent implements AfterContentInit {

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  @ViewChild('panel') panel: ElementRef;

  @ViewChild('panelStatic') panelStatic: ElementRef;

  @ContentChildren(AutocompleteOptionComponent, { descendants: true })
  items: QueryList<AutocompleteOptionComponent> = new QueryList<AutocompleteOptionComponent>();

  @ContentChildren(AutocompleteOptionComponent)
  staticItems: QueryList<AutocompleteOptionComponent> = new QueryList<AutocompleteOptionComponent>();

  @Input()
  filter: string;

  @Input()
  options?: Array<any> = [];

  @Input()
  staticOptions?: Array<any>;

  @Input()
  get autoActiveFirstOption(): boolean { return this._autoActiveFirstOption; }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /** Event that is emitted whenever an option from the list is selected. */
  @Output() readonly optionSelected: EventEmitter<SbbAutocompleteSelectedEvent> =
    new EventEmitter<SbbAutocompleteSelectedEvent>();

  @Output()
  readonly opened: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  readonly closed: EventEmitter<void> = new EventEmitter<void>();

  _keyManager: ActiveDescendantKeyManager<AutocompleteOptionComponent>;
  showPanel = false;

  /** Emits the `select` event. */
  emitSelectEvent(option: AutocompleteOptionSelectionChange): void {
    const event = new SbbAutocompleteSelectedEvent(this, option.source);
    this.optionSelected.emit(event);
  }

  ngAfterContentInit() {
    this._keyManager = new ActiveDescendantKeyManager<AutocompleteOptionComponent>(this.items)
      .withWrap()
      .withTypeAhead();
    // Set the initial visibility state.
    this.setVisibility();
  }

  /** Panel should hide itself when the option list is empty. */
  setVisibility() {
    this.showPanel = !!this.options.length;
    this._changeDetectorRef.markForCheck();
  }

  /** Returns the panel's scrollTop. */
  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }
}
