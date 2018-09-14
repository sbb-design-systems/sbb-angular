import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-nebel',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.904 15.306l.792-.612C9.253 14.121 9 13.321 9 12.5 9 10.57 10.57 9 12.5 9s3.5 1.57 3.5 3.5c0 .77-.281 1.545-.791 2.186l.781.623c.652-.817 1.01-1.814 1.01-2.809 0-2.481-2.019-4.5-4.5-4.5S8 10.019 8 12.5c0 1.053.32 2.049.904 2.806zM4 12h3v1H4zM6.085 6.704l.706-.71L9.06 8.253l-.706.71zM12 4h1v3h-1zM16.035 8.34L18.3 6.088l.705.709-2.265 2.252zM18 12h3v1h-3zM5 16h13.993v1H5z"/></svg>',
  styles: []
})
export class IconNebelComponent {
  constructor() { }

  @Input() svgClass = '';
}
