import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-plus',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 12.5h-7.5V20h-1v-7.5H4v-1h7.5V4h1v7.5H20v1z"/></svg>',
  styles: []
})
export class IconPlusComponent {
  constructor() { }

  @Input() svgClass = '';
}
