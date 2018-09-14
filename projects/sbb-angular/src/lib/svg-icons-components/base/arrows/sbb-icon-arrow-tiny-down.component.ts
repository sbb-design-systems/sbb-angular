import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-arrow-tiny-down',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.642 11.112L12 12.638 9.16 10l-.66.673L12 14l3.5-3.327-.661-.673z"/></svg>',
  styles: []
})
export class IconArrowTinyDownComponent {
  constructor() { }

  @Input() svgClass = '';
}
