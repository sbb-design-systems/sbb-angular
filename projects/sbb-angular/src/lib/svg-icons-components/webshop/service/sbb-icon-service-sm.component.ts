import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-sm',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 13"><path d="M9.2 2.6C8.4 2.3 7.5 2 6.6 2c-.9 0-2.1.3-2.1 1.4 0 2 4.3 1.9 4.3 5.4 0 3.1-2.4 4.2-5.2 4.2-1.2 0-2.4-.3-3.6-.7l.6-2.1c1 .5 2 .9 3.1.9 1.2 0 2.4-.6 2.4-2 0-2.3-4.3-1.9-4.3-5.3C1.8 1.2 4.1 0 6.5 0c1.1 0 2.2.1 3.3.6l-.6 2zM13.1.2h4.2l.8 9.1 5-9.1h4.2l-2.7 12.6h-2.7l2.4-10.4-5.7 10.4h-2.4l-1-10.4-2.3 10.4h-2.4"/></svg>',
  styles: []
})
export class IconServiceSmComponent {
  constructor() { }

  @Input() svgClass = '';
}
