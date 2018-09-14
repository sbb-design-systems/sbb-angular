import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-2',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 13"><path d="M0 0h10.8v13H0V0zm1.2 11.8h8.4V1.2H1.2v10.6z"/><path d="M3 9.4l.7-.7c.9-1.1 1.6-1.9 2-2.4.3-.6.5-1.1.5-1.6 0-.7-.4-1.1-1.1-1.1-.6 0-1.2.2-1.7.7l-.1.1-.1-1.5.1-.1c.2-.1.3-.1.4-.2.1 0 .3-.1.6-.2.2-.1.6-.1 1-.1.8 0 1.4.2 1.8.5.4.4.6.9.6 1.6 0 .2 0 .4-.1.7 0 .2-.1.5-.3.9-.1.4-.4.9-.8 1.5s-.8 1.2-1.3 1.6l-.1.2h2.7v1.4H3V9.4"/></svg>',
  styles: []
})
export class IconService2Component {
  constructor() { }

  @Input() svgClass = '';
}
