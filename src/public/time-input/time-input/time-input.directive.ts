import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Optional,
  Renderer2,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';

const REGEX_PATTERN = /[0-9]{3,4}/;
const REGEX_GROUPS_WITH_COLON = /([0-9]{1,2})[.:,\-;_hH]?([0-9]{1,2})?/;
const REGEX_GROUPS_WO_COLON = /([0-9]{1,2})([0-9]{2})/;

@Directive({
  selector: 'input[sbbTimeInput]'
})
export class TimeInputDirective {
  private _document: Document;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    @Self() @Optional() private _control: NgControl,
    @Inject(DOCUMENT) document: any
  ) {
    this._document = document;
  }
  /**
   * Value type allowed
   */
  @HostBinding('attr.type') type = 'text';
  /**
   * Allowed pattern for time input value
   */
  @HostBinding('attr.pattern') pattern = '[0-9]*';
  /**
   * Input mode for time input
   */
  @HostBinding('attr.inputmode') inputmode = 'numeric';
  /**
   * Class property that refers to time input
   */
  @HostBinding('class.sbb-time-input') ssbTimeInput = true;

  /**
   * Method that sets the input value in 'hours:mins' format on blur event
   */
  @HostListener('blur', ['$event.target.value'])
  onBlur(value: any) {
    const regGroups = this._inputValidate(value);
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

  private _inputValidate(value: string) {
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
