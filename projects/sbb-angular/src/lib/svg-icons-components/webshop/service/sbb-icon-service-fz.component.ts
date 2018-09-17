import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-fz',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 13"><path d="M2.7 0h7.2l-.4 2H4.9l-.7 3.3h4.3l-.4 2H3.8L2.6 13H0M11.5 0h8.9L20 2l-7.9 9H18l-.4 2H8.5l.4-2 7.8-9H11"/></svg>',
  styles: []
})
export class IconServiceFzComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
