import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  QueryList,
  ViewChildren,
  AfterViewInit
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
export class AutocompleteOptionListComponent implements AfterViewInit {

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  @ViewChildren(AutocompleteOptionComponent)
  items: QueryList<AutocompleteOptionComponent>;

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

  keyManager: ActiveDescendantKeyManager<AutocompleteOptionComponent>;

  /** Emits the `select` event. */
  emitSelectEvent(option: AutocompleteOptionSelectionChange): void {
    const event = new SbbAutocompleteSelectedEvent(this, option.source);
    this.optionSelected.emit(event);
  }

  ngAfterViewInit() {
    this.keyManager = new ActiveDescendantKeyManager<AutocompleteOptionComponent>(this.items)
      .withWrap()
      .withTypeAhead();
  }

}
