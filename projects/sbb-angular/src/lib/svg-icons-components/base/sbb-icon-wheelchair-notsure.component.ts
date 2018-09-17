import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-wheelchair-notsure',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 8H6v7h6v4h1v-6H8z"/><path d="M6.5 18C4.57 18 3 16.43 3 14.5c0-1.32.737-2.517 1.925-3.121l-.454-.892A4.49 4.49 0 0 0 2 14.501C2 16.982 4.018 19 6.5 19a4.529 4.529 0 0 0 4.071-2.59l-.904-.428A3.524 3.524 0 0 1 6.5 18.001zM17.045 16.998h1v2h-1zM21.41 7.646c-.163-.912-.778-1.734-1.666-2.207-1.316-.641-2.904-.595-4.042.114C14.604 6.24 14 7.463 14 9h1c0-1.196.426-2.094 1.232-2.598.852-.533 2.058-.559 3.058-.073.602.322 1.025.88 1.134 1.491.122.686-.153 1.429-.778 2.127l-1.521 1.522C17.048 12.69 17 13.476 17 15h1c0-1.425.04-1.922.854-2.845l1.519-1.52c1.08-1.207 1.16-2.291 1.036-2.988z"/><circle cx="7" cy="6" r="1"/></svg>',
  styles: []
})
export class IconWheelchairNotsureComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
