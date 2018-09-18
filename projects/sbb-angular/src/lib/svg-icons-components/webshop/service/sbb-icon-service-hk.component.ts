import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-hk',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 13"><path d="M2.7 0h2.6L4.2 5.3h5.3L10.6 0h2.6l-2.7 13H7.9l1.2-5.7H3.8L2.6 13H0M22.9 0l-5.2 5.1L18.8 0h-2.6l-2.8 13H16l1.4-6.6L21 13h3.1L20 5.9 26.6 0"/></svg>',
  styles: []
})
export class IconServiceHkComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
