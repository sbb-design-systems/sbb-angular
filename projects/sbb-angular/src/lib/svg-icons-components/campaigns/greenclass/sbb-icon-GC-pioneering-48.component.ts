import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-gc-pioneering-48',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M15.5 32.5l10.7-6.4 6.4-10.7-10.7 6.4-6.4 10.7zm6.8-9.5l2.6 2.6-6.6 3.9 4-6.5zm3.4 2L23 22.3l6.6-3.9-3.9 6.6z"/><path d="M24 7.5C14.9 7.5 7.5 14.9 7.5 24S14.9 40.5 24 40.5 40.5 33.1 40.5 24 33.1 7.5 24 7.5zm.5 32v-3h-1v3c-8.2-.3-14.7-6.8-15-15h3v-1h-3c.3-8.2 6.8-14.7 15-15v3h1v-3c8.2.3 14.7 6.8 15 15h-3v1h3c-.3 8.2-6.8 14.7-15 15z"/></svg>',
  styles: []
})
export class IconGcPioneering48Component {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
