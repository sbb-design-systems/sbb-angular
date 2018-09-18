import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-tg',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 13"><path d="M.4.2h9.7l-.4 2H6.2L3.9 12.8H1.3L3.5 2.2H0m20.9.7c-.9-.6-2.1-.9-3.5-.9-3.1 0-5 2.4-5 5.4 0 2 1.4 3.7 3.5 3.7.6 0 1 0 1.2-.1l.7-3.3h-2.7l.4-2h5.1l-1.4 6.9c-.6.1-2 .4-3.2.4-3.7 0-6.2-1.7-6.2-5.6 0-4.6 3-7.4 7.5-7.4 1.4 0 2.9.2 4.2.7.1 0-.6 2.2-.6 2.2z"/></svg>',
  styles: []
})
export class IconServiceTgComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
