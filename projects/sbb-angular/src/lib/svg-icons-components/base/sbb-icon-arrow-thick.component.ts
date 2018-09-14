import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-arrow-thick',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.57 7.035l3.58 3.7H4v1.488h13.15l-3.58 3.7 1.073 1.034 5.3-5.478L14.642 6z"/></svg>',
  styles: []
})
export class IconArrowThickComponent {
  constructor() { }

  @Input() svgClass = '';
}
