import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-r',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 13"><path d="M6.7 8c-.1-.5-.3-.8-.5-1.1-.2-.2-.5-.3-.9-.4C7 6.1 7.8 5.1 7.8 3.4c0-1.1-.3-1.9-1-2.5C6.2.3 5.2 0 4 0H0v13h2.3V7.4h.6c.9 0 1.5.5 1.8 1.4L6 13h2.5L6.7 8zM3.3 5.5h-1V1.7h1c.7 0 1.3.1 1.6.4.3.3.5.8.5 1.4 0 .6-.2 1.1-.5 1.5-.4.3-.9.5-1.6.5z"/></svg>',
  styles: []
})
export class IconServiceRComponent {
  constructor() { }

  @Input() svgClass = '';
}
