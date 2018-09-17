import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-touch',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.5 12.5l-.002-6a1.002 1.002 0 0 1 2.002 0V13"/><path d="M15.5 12.5a1 1 0 0 1 2.003 0s-.003.562-.003 3.5-.9 4.5-.9 4.5H9.5l-3.707-6.29c-.312-.532-.39-1.026 0-1.417.39-.39 1.026-.39 1.417 0l2.288 2.29H9.5V12.5l-.002-5a1.002 1.002 0 0 1 2.002 0v5.508"/><path d="M13.497 11.5a1.001 1.001 0 1 1 2.003-.001V13M15 8.152c.316-.472.5-1.04.5-1.652a3 3 0 0 0-3-3c-.896 0-1.692.4-2.24 1.024A2.99 2.99 0 0 0 7.5 7.5c0 .608.184 1.17.494 1.644"/></svg>',
  styles: []
})
export class IconTouchComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
