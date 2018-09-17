import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-rt',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 13"><path d="M4.2 5.5h.9c1.4 0 3.1-.4 3.1-2.1C8.3 2 7.1 2 6 2H4.9l-.7 3.5zM2.7 0h3.1C8.2 0 11 0 11 3.1c0 2.2-1.7 3.4-3.8 3.5.7 0 1.2.5 1.3 1.2L9.7 13H7l-.6-3.1c-.3-1.3-.3-2.3-1.7-2.3h-1L2.6 13H0L2.7 0zm10 0h10l-.4 2h-3.7l-2.4 11h-2.7l2.4-11h-3.7"/></svg>',
  styles: []
})
export class IconServiceRtComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
