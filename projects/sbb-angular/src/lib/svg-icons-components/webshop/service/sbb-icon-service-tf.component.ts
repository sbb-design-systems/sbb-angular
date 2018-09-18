import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-tf',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 13"><path d="M.4 0h10L10 2H6.4L4 13H1.3L3.7 2H0m12.1-2h7.2l-.4 2h-4.5l-.7 3.2H18l-.4 2h-4.4L12 13H9.4"/></svg>',
  styles: []
})
export class IconServiceTfComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
