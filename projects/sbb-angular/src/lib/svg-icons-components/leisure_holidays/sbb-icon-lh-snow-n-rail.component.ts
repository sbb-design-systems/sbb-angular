import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-lh-snow-n-rail',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path stroke-miterlimit="10" d="M18 32.5l2.5 6m-14 0l2.5-6m11.5 3h-14m15.5 3H5" vector-effect="non-scaling-stroke"/><circle cx="10.5" cy="28.5" r="1" stroke-miterlimit="10" vector-effect="non-scaling-stroke"/><circle cx="16.5" cy="28.5" r="1" stroke-miterlimit="10" vector-effect="non-scaling-stroke"/><path stroke-miterlimit="10" d="M17 16.5h-7m-.264-3C6.91 13.5 5.5 14.945 5.5 17.775V32.5h16V17.775S20.089 13.5 17.264 13.5H9.736zm11.764 11h-16M18 9.5H9m4.5 4l-2-4m16 5a1.5 1.5 0 0 0-3 0v24h3v-24zm6 0a1.5 1.5 0 0 0-3 0v24h3v-24zm4.827 23.117l-2.954-.521m6.037-23.93l-4.82 25.667m4.083-1.216l2.954-.521m-6.037-23.93l4.82 25.667M37.372 17.33l-.564-3m5.384 0l-.564 3M15.5 9.5l-2 4" vector-effect="non-scaling-stroke"/></svg>',
  styles: []
})
export class IconLhSnowNRailComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
