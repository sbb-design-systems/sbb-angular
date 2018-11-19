import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[sbbTimeInput]'
})
export class TimeInputDirective {

  private REGEX_PATTERN = /[0-9]{3,4}/;
  private REGEX_GROUPS_WITH_COLON = /([0-9]{1,2})[.:,\-;_hH]?([0-9]{1,2})?/;
  private REGEX_GROUPS_WO_COLON = /([0-9]{1,2})([0-9]{2})/;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostBinding('attr.type') type = 'text';
  @HostBinding('attr.pattern') pattern = '[0-9]*';
  @HostBinding('attr.inputmode') inputmode = 'numeric';
  @HostBinding('class.ssb-time-input') ssbTimeInput = true;


  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    const regGroups = this.inputValidate(value);

    if (regGroups && regGroups.length > 2) {
      const hours = this.parseHour(regGroups[1]);
      const mins = this.parseMinute(regGroups[2]);
      this.renderer.setProperty(this.el.nativeElement, 'value', `${hours}:${mins}`);
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

  private parseHour(regGroupHours) {
    return regGroupHours.length > 1 ? regGroupHours : '0' + regGroupHours;
  }

  private parseMinute(regGroupMin) {
    regGroupMin = regGroupMin || '00';
    return regGroupMin.length > 1 ? regGroupMin : '0' + regGroupMin;
  }
}
