import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-clock-minutes',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 226 226"><path d="M109.4 21.8h7.1l1.6 115h-10.3z"/></svg>',
  styles: []
})
export class IconClockMinutesComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
