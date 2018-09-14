import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-stratus',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 4h5v1h-5zM8 6h9v1H8zM7 8h10v1H7zM6 10h3v1H6zM10 10h9v1h-9zM7 12.005h12v1H7z"/></svg>',
  styles: []
})
export class IconStratusComponent {
  constructor() { }

  @Input() svgClass = '';
}
