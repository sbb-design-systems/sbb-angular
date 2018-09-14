import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-arrow-right-bold',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13 10.1l5.6 5.9-5.6 6 1.4 1.4 7.1-7.4-7.1-7.3z"/></svg>',
  styles: []
})
export class IconArrowRightBoldComponent {
  constructor() { }

  @Input() svgClass = '';
}
