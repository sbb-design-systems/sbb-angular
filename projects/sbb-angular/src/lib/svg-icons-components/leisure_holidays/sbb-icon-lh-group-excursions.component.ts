import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-lh-group-excursions',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="35.5" cy="12.5" r="2" fill="none" stroke="#000" stroke-miterlimit="10" vector-effect="non-scaling-stroke"/><path fill="none" stroke="#000" stroke-miterlimit="10" d="M33.5 37.5V40m4-2.499V40m-7-10.5l2-12h6l2 12" vector-effect="non-scaling-stroke"/><path fill="none" stroke="#000" stroke-miterlimit="10" d="M39.5 37.5l-1-10h-6l-1 10z" vector-effect="non-scaling-stroke"/><circle cx="23.5" cy="12.5" r="2" fill="none" stroke="#000" stroke-miterlimit="10" vector-effect="non-scaling-stroke"/><path fill="none" stroke="#000" stroke-miterlimit="10" d="M21.5 27.5V40m4-12.5V40m-6-10.5v-12h8v12m-8-2h8" vector-effect="non-scaling-stroke"/><circle cx="12.5" cy="12.5" r="2" fill="none" stroke="#000" stroke-miterlimit="10" vector-effect="non-scaling-stroke"/><path fill="none" stroke="#000" stroke-miterlimit="10" d="M10.5 27.5V40m4-12.5V40m-6-10.5v-12h8v12m-8-2h8" vector-effect="non-scaling-stroke"/></svg>',
  styles: []
})
export class IconLhGroupExcursionsComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
