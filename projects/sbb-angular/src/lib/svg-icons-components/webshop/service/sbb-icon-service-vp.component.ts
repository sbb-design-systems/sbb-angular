import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-vp',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 13"><path d="M0 0h2.6l1.2 10.1L9.3 0h2.8L4.8 13H1.7m13.2-7h.9c1.4 0 2.9-.7 2.9-2.4 0-1.3-1.1-1.6-2.2-1.6h-.8c.1 0-.8 4-.8 4zm-1.5 7h-2.6l2.8-13h2.2c2.4 0 5.7.1 5.7 3.4 0 3.1-2.6 4.7-5.5 4.7h-1.5L13.4 13z"/></svg>',
  styles: []
})
export class IconServiceVpComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
