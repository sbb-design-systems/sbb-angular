import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-clock-hours',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 226 226"><path d="M107.8 49.5h10.3l1.2 87.3h-12.7z"/></svg>',
  styles: []
})
export class IconClockHoursComponent {
  constructor() { }

  @Input() svgClass = '';
}
