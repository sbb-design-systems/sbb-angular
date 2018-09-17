import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-mp',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 13"><path d="M2.8 0h4.3L8 9.4 13.1 0h4.3l-2.8 13h-2.8l2.5-10.8L8.4 13H5.9l-1-10.8L2.5 13H0m21.5-7h.9c1.4 0 2.9-.7 2.9-2.4 0-1.3-1.1-1.6-2.2-1.6h-.8l-.8 4zM20 13h-2.6l2.8-13h2.2c2.3 0 5.6.1 5.6 3.4 0 3.1-2.6 4.7-5.5 4.7H21L20 13z"/></svg>',
  styles: []
})
export class IconServiceMpComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
