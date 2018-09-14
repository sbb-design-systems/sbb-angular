import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-round-trip',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.4 10.3l.7-.7 3.9 3.9-3.9 3.9-.7-.7L20 14H9v-1h11l-2.6-2.7zM3.9 11H15v-1H3.9l2.7-2.7-.7-.7L2 10.5l3.9 3.9.7-.8L3.9 11z"/></svg>',
  styles: []
})
export class IconRoundTripComponent {
  constructor() { }

  @Input() svgClass = '';
}
