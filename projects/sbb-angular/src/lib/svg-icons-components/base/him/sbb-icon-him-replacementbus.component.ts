import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-him-replacementbus',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8.5 13c-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9c1.6 0 2.9-1.3 2.9-2.9S10.1 13 8.5 13zm0 4.2c-.8 0-1.4-.6-1.4-1.3 0-.7.6-1.3 1.4-1.3s1.4.6 1.4 1.3c0 .7-.6 1.3-1.4 1.3zm6.8-12c-.1-.8-.8-1.4-1.6-1.4H0v1.5h2v5.3H0v5.2h4.6c0-2.1 1.7-3.8 3.9-3.8 2.1 0 3.9 1.7 3.9 3.8h2.8c.7 0 1.3-.6 1.3-1.4v-3.6l-1.2-5.6zm-12.4.1h4v5.3h-4V5.3zm5.1 0h1.1v5.4H8V5.3zm2.1 0h1.1v5.4h-1.1V5.3zm2.2 5.3V5.3h1.8l1.2 5.4h-3v-.1z"/></svg>',
  styles: []
})
export class IconHimReplacementbusComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
