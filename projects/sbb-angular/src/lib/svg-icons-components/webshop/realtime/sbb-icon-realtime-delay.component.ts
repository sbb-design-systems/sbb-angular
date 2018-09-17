import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-realtime-delay',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5zM10 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm.4-9.8H9.2v4.4l3.9 2.3.6-.9-3.4-2V6.2z"/></svg>',
  styles: []
})
export class IconRealtimeDelayComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
