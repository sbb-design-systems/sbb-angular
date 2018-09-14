import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-laptop-smartphone-165',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 12v10h7V12h-7zm6 9h-5v-2h5v2zm0-3h-5v-5h5v5z"/><path d="M17.5 19.5h2v1h-2v-1zM19 4H6v9.2l-4 3V19h12v-1H3v-1h11v-1H4l2.7-2H14v-1H7V5h12v6h1V4z"/></svg>',
  styles: []
})
export class IconLaptopSmartphone165Component {
  constructor() { }

  @Input() svgClass = '';
}
