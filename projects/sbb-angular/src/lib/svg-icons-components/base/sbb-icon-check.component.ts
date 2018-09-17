import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-check',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.6 17.05l-4.399-4.4.699-.7 3.6 3.6 8.6-8.6.7.699-9.2 9.401z"/></svg>',
  styles: []
})
export class IconCheckComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
