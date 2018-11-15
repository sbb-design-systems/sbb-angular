import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[sbbTimeInput]'
})
export class TimeInputDirective {

  private REGEX_PATTERN = /[0-9]{3,4}/; // /^([01]?[0-9]|2[0-3])([0-5][0-9])$/;
  private REGEX_GROUPS_WITH_COLON = /([0-9]{1,2})[.:,\-;_hH]?([0-9]{1,2})?/; // /^([01]?[0-9]|2[0-3])[.:,\-;_hH]?([0-5][0-9])$/;
  private REGEX_GROUPS_WO_COLON = /([0-9]{1,2})([0-9]{2})/; // /^([01]?[0-9]|2[0-3])([0-5][0-9])$/; //

  constructor(private el: ElementRef) {
  }

  @HostBinding('attr.type') type = 'text';
  @HostBinding('attr.pattern') pattern = '[0-9]*';
  @HostBinding('attr.inputmode') inputmode = 'numeric';
  @HostBinding('class.ssb-time-input') ssbTimeInput = true;


  @HostListener('blur')
  onBlur() {
    const regGroups = this.inputValidate(this.el.nativeElement.value);
    if (regGroups && regGroups.length > 2) {
      const hours = regGroups[1];
      const mins = regGroups[2];
      this.el.nativeElement.value = `${hours}:${mins}`;
    }
  }

  private inputValidate(value: string) {
    if (this.REGEX_PATTERN.test(value)) {
      // special case: the input is 3 or 4 digits; split like so: AB?:CD
      return value.match(this.REGEX_GROUPS_WO_COLON);
    } else if (value) {
      return value.match(this.REGEX_GROUPS_WITH_COLON);
    }

  }
}
