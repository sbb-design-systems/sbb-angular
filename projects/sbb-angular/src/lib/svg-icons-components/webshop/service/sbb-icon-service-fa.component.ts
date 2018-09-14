import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-fa',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 13"><path d="M2.7 0h7.2l-.4 2H4.9l-.7 3.3h4.3l-.4 2H3.8L2.6 13H0m13.2-5h4l-.8-5.7h-.1L13.2 8zm2.2-8h2.9l2.4 13H18l-.4-3H12l-1.7 3H7.5l7.9-13z"/></svg>',
  styles: []
})
export class IconServiceFaComponent {
  constructor() { }

  @Input() svgClass = '';
}
