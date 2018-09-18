import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-map',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12.5" cy="10.5" r="3.5" fill="none" stroke="#000" stroke-miterlimit="10"/><path fill="none" stroke="#000" stroke-miterlimit="10" d="M7 10.5c0 .9.3 1.7.8 2.5l4.7 7.5 4.8-7.5c.4-.8.7-1.6.7-2.5 0-3-2.5-5.5-5.5-5.5S7 7.5 7 10.5z"/></svg>',
  styles: []
})
export class IconServiceMapComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
