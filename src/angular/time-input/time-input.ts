import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SbbInput } from '@sbb-esta/angular/input';

const REGEX_PATTERN = /[0-9]{3,4}/;
const REGEX_GROUPS_WITH_COLON = /([0-9]{1,2})[.:,\-;_hH]?([0-9]{1,2})?/;
const REGEX_GROUPS_WO_COLON = /([0-9]{1,2})([0-9]{2})/;
const PLACEHOLDER_DEFAULT = 'HH:MM';

@Directive({
  selector: 'input[sbbTimeInput]',
  exportAs: 'sbbTimeInput',
  host: {
    class: 'sbb-time-input sbb-input-element',
    type: 'text',
    pattern: '[0-9]*',
    inputmode: 'numeric',
    '[attr.placeholder]': 'placeholder',
  },
})
export class SbbTimeInput {
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _control = inject(NgControl, { self: true, optional: true })!;
  private _input = inject(SbbInput, { optional: true })!;

  /** The placeholder value display in the input field (defaults to HH:MM) */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value ?? PLACEHOLDER_DEFAULT;

    if (this._input) {
      this._input.placeholder = this._placeholder;
    }
  }
  private _placeholder: string;

  private _document = inject(DOCUMENT);

  constructor(...args: unknown[]);
  constructor() {
    this.placeholder = PLACEHOLDER_DEFAULT;
  }

  /** Method that sets the input value in 'hours:mins' format on blur event */
  @HostListener('blur', ['$event.target.value'])
  _onBlur(value: any) {
    const regGroups = this._validateInput(value);
    if (!regGroups || regGroups.length <= 2) {
      return;
    }

    const hours = this._parseHour(regGroups[1]);
    const mins = this._parseMinute(regGroups[2]);
    if (this._control && this._control.control) {
      this._control.control.setValue(`${hours}:${mins}`);
    } else {
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', `${hours}:${mins}`);
      const event = this._document.createEvent('Event');
      event.initEvent('input', true, true);
      this._elementRef.nativeElement.dispatchEvent(event);
    }
  }

  private _validateInput(value: string) {
    if (REGEX_PATTERN.test(value)) {
      // special case: the input is 3 or 4 digits; split like so: AB?:CD
      return value.match(REGEX_GROUPS_WO_COLON);
    } else if (value) {
      return value.match(REGEX_GROUPS_WITH_COLON);
    } else {
      return null;
    }
  }

  private _parseHour(regGroupHours: string) {
    return regGroupHours.length > 1 ? regGroupHours : '0' + regGroupHours;
  }

  private _parseMinute(regGroupMin: string) {
    regGroupMin = regGroupMin || '00';
    return regGroupMin.length > 1 ? regGroupMin : '0' + regGroupMin;
  }
}
