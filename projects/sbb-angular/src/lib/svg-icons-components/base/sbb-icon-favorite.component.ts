import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-favorite',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6.2l1.4 4.1.2.7H18l-3 2.2-.6.4.2.7 1.4 4.2-3.6-2.4-.4-.3-.6.4-3.5 2.3 1.5-4.1.3-.7-.6-.4-3-2.2h4.3l.2-.7L12 6.2M12 3l-2.3 7H3l5.5 4L6 21l6-4 6 4-2.4-7 5.4-4h-6.7L12 3z"/></svg>',
  styles: []
})
export class IconFavoriteComponent {
  constructor() { }

  @Input() svgClass = '';
}
