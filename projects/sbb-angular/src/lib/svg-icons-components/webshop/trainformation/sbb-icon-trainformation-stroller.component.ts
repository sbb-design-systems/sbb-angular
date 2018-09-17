import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-trainformation-stroller',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.7 15.5c-1.3 0-2.3 1.1-2.2 2.4 0 1.3 1.1 2.3 2.4 2.2 1.2 0 2.2-1.1 2.2-2.3-.1-1.3-1.1-2.3-2.4-2.3zm0 3.9c-.9 0-1.6-.8-1.6-1.7 0-.9.8-1.6 1.7-1.6s1.6.7 1.6 1.6c0 1-.8 1.7-1.7 1.7zm6.1-3.9c-1.3 0-2.3 1.1-2.2 2.4.1 1.3 1.1 2.3 2.4 2.2 1.2 0 2.2-1.1 2.2-2.3-.1-1.3-1.2-2.3-2.4-2.3zm0 3.9c-.9 0-1.6-.8-1.6-1.7 0-.9.8-1.6 1.7-1.6s1.6.7 1.6 1.6c-.1 1-.8 1.7-1.7 1.7zm-7.6-4.6h9.1c1.2-1.4 1.9-3.1 2.1-4.9H5.1c.2 1.9.9 3.6 2.1 4.9zm4-6.1L8.4 4C6.4 5 5.2 7.1 5 9.3h5.8c.2 0 .4-.1.4-.3.1-.1.1-.2 0-.3zm9.3.3h-4v.5h4c.1 0 .3-.1.3-.3 0-.2-.2-.2-.3-.2z"/></svg>',
  styles: []
})
export class IconTrainformationStrollerComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
