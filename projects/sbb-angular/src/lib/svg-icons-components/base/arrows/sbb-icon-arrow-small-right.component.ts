import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-arrow-small-right',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.7 16.2l-.7-.6 3.6-3.6L10 8.4l.7-.7L15 12l-4.3 4.2z"/></svg>',
  styles: []
})
export class IconArrowSmallRightComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
