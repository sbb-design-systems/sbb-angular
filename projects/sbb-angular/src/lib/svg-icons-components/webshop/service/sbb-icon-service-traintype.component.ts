import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-traintype',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.6 15.6h-2.7c-.301 0-.5-.1-.7-.3s-.3-.4-.3-.7h4.8c0 .3-.101.5-.3.7-.3.2-.6.3-.8.3zm-8.5 0H6.4c-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7h4.8c0 .3-.1.5-.3.7-.2.2-.5.3-.8.3zm-4.1-4h14v-2H5v2zM4 8h16v6H4V8z"/></svg>',
  styles: []
})
export class IconServiceTraintypeComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
