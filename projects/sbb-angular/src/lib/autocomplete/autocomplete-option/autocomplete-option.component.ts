import { Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';
import { Option } from '../option.model';

export class AutocompleteOptionSelectionChange {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: AutocompleteOptionComponent,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false) { }
}

@Component({
  selector: 'sbb-autocomplete-option',
  templateUrl: './autocomplete-option.component.html',
  styleUrls: ['./autocomplete-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteOptionComponent implements Highlightable {

  private _selected = false;
  private _active = false;
  private _disabled = false;
  private _mostRecentViewValue = '';

  @Input() item: Option;
  @Input() filter: string;

  @HostBinding('class.selected') selected: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() readonly onSelectionChange = new EventEmitter<AutocompleteOptionSelectionChange>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  setActiveStyles(): void {
    this.selected = true;
  }

  setInactiveStyles(): void {
    this.selected = false;
  }

  getLabel?(): string {
    return this.item.getLabel();
  }

  selectOption($event) {
    this._emitSelectionChangeEvent(true);
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new AutocompleteOptionSelectionChange(this, isUserInput));
  }


  /**
 * `Selects the option while indicating the selection came from the user. Used to
 * determine if the select's view -> model callback should be invoked.`
 */
  _selectViaInteraction(): void {
    if (!this._disabled) {
      this._selected = !this._selected;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

}
