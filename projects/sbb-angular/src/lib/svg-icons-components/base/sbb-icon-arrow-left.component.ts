import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-arrow-left',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.4 18.4l-.7-.7 5.6-5.6-5.7-5.7.7-.7 6.4 6.4-6.3 6.3z"/></svg>',
  styles: []
})
export class IconArrowLeftComponent {
  constructor() { }

  @Input() svgClass = '';
}
