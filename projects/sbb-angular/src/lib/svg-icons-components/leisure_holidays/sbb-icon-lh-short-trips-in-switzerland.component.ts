import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-lh-short-trips-in-switzerland',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path stroke-miterlimit="10" d="M21.5 16l-5 .5-4 2 9-12 9.006 12-4-2-5-.5zm-8 5.48l2-.996 6-.498" vector-effect="non-scaling-stroke"/><path stroke-miterlimit="10" d="M13.5 18v3.5l1.006 2 2-.5h5" vector-effect="non-scaling-stroke"/><path stroke-miterlimit="10" d="M15.5 17v3.5l1.006 2.5v6.08M21.5 16v12.758M14.506 23.5v5.71m15-7.73l-2-.996-6-.498" vector-effect="non-scaling-stroke"/><path stroke-miterlimit="10" d="M29.506 18v3.5l-1.006 2-2-.5h-5" vector-effect="non-scaling-stroke"/><path stroke-miterlimit="10" d="M27.506 17v3.5L26.5 23v5.435m2-4.935v4.804M41 32.5l-34 2 3.005-5L41 27.5m0 8l-33 2v-3m1.5 2.923V41m14.001-4.44V40m14.001-4.289V39" vector-effect="non-scaling-stroke"/></svg>',
  styles: []
})
export class IconLhShortTripsInSwitzerlandComponent {
  constructor() { }

  @Input() svgClass = '';
}
