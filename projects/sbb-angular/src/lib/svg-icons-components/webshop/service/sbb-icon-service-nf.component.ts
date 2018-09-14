import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-service-nf',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 13"><path d="M11 0L8.9 9.9 6.1 0H2.8L0 13h2.5L4.6 3l2.7 10h3.4l2.8-13m2.8 0l-2.7 13h2.6l1.2-5.7h4.4l.4-2.1h-4.3l.6-3.2H23l.4-2"/></svg>',
  styles: []
})
export class IconServiceNfComponent {
  constructor() { }

  @Input() svgClass = '';
}
