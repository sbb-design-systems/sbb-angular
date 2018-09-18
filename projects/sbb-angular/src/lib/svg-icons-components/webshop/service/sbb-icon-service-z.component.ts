import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-z',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 13"><path d="M3 0h8.9l-.4 2-7.9 9h5.9l-.4 2H0l.4-2 7.8-9H2.6"/></svg>',
  styles: []
})
export class IconServiceZComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
