import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-arrow-down',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.6 7.5l-.8.8 3.7 3.7h-12v1h12l-3.7 3.7.8.7 5-5"/></svg>',
  styles: []
})
export class IconArrowDownComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
