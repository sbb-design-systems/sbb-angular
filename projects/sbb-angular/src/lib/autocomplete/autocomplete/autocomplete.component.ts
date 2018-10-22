import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '@angular/cdk/keycodes';

import {
  AutocompleteOptionListComponent,
  SbbAutocompleteSelectedEvent
} from '../autocomplete-option-list/autocomplete-option-list.component';
import { AutocompleteOptionComponent } from '..';

/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionIndex Index of the option to be scrolled into the view.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function _getOptionScrollPosition(optionIndex: number, optionHeight: number,
  currentScrollPosition: number, panelHeight: number): number {
  const optionOffset = optionIndex * optionHeight;

  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}

const AUTOCOMPLETE_OPTION_HEIGHT = 20;
const AUTOCOMPLETE_PANEL_HEIGHT = 30;


@Component({
  selector: 'sbb-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements ControlValueAccessor {

  filter: string;
  value: any;
  disabled: boolean;

  @ViewChild('optionsList')
  optionsList: AutocompleteOptionListComponent;

  @Input()
  minDigitsTrigger = 3;

  @Input()
  staticOptions?: Array<any>;

  @Input()
  options?: Array<any> = [];

  @Output()
  inputedText: EventEmitter<string> = new EventEmitter<string>();

  isFocused = false;
  get showOptions() { return this.isFocused && !!this.options.length; }


  /** The currently active option, coerced to MatOption type. */
  get activeOption(): AutocompleteOptionComponent | null {
    if (this.optionsList && this.optionsList._keyManager) {
      return this.optionsList._keyManager.activeItem;
    }

    return null;
  }

  propagateChange: any = () => { };

  writeValue(newValue: any): void {
    if (newValue) {
      this.value = newValue;
      this.propagateChange(newValue);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void { }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setVisibility() {
    this.isFocused = (this.filter.length >= this.minDigitsTrigger) || (this.staticOptions && !!this.staticOptions.length);
  }

  onInput($event) {
    this.filter = $event.target.value;
    console.log('input', $event.target.value);
    this.setVisibility();
    this.inputedText.emit(this.filter);
  }

  /*   onBlur($event) {
      const keycode = $event.keyCode;
      ofthis.showOptions || keyCode === TAB
      this.isFocused = false;
    }
   */
  /**
   * Resets the active item to -1 so arrow events will activate the
   * correct options, or to 0 if the consumer opted into it.
   */
  private _resetActiveItem(): void {
    this.optionsList._keyManager.setActiveItem(this.optionsList.autoActiveFirstOption ? 0 : -1);
  }



  private _scrollToOption(): void {
    const index = this.optionsList._keyManager.activeItemIndex || 0;
    /* const labelCount = _countGroupLabelsBeforeOption(index,
        this.optionsList.options, this.optionsList.optionGroups); */

    const newScrollPosition = _getOptionScrollPosition(
      index,
      AUTOCOMPLETE_OPTION_HEIGHT,
      this.optionsList._getScrollTop(),
      AUTOCOMPLETE_PANEL_HEIGHT
    );

    this.optionsList._setScrollTop(newScrollPosition);
  }

  onOptionSelected(selectedOption: SbbAutocompleteSelectedEvent) {
    this.filter = selectedOption.option.item.getLabel();
    this.writeValue(selectedOption.option);
    this.isFocused = false;
  }

  scrollOptions($event) {
    const keyCode = $event.keyCode;
    console.log('scrollOptions keycode', keyCode);
    // Prevent the default action on all escape key presses. This is here primarily to bring IE
    // in line with other browsers. By default, pressing escape on IE will cause it to revert
    // the input value to the one that it had on focus, however it won't dispatch any events
    // which means that the model value will be out of sync with the view.
    if (keyCode === ESCAPE) {
      event.preventDefault();
    }
    console.log('scrollOptions activeOption', this.activeOption);

    if (this.activeOption && keyCode === ENTER && this.showOptions) {
      this.activeOption._selectViaInteraction();
      this._resetActiveItem();
      event.preventDefault();
    } else if (this.optionsList) {
      const prevActiveItem = this.optionsList._keyManager.activeItem;
      const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
      console.log('scrollOptions prevActiveItem', prevActiveItem);

      if (this.showOptions || keyCode === TAB) {
        this.optionsList._keyManager.onKeydown($event);
      } else if (isArrowKey) {
        console.log('isArrowKey', isArrowKey);

        this.setVisibility();
      }

      if (isArrowKey || this.optionsList._keyManager.activeItem !== prevActiveItem) {
        this._scrollToOption();
      }
    }
  }
}
