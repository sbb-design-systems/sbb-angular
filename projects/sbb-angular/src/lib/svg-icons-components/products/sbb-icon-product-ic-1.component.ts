import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-product-ic-1',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 20"><path d="M42.4 4.218v11.564h-2.31v-7.57h-2.721V6.535c.564-.015 1.024-.073 1.38-.174.356-.1.682-.263.977-.49.427-.327.714-.878.862-1.653H42.4zM9.249 4.2h4.07L8.284 15.8H4.197zM16 4.2h14.443l-1.496 3.445H18.632l-2.048 4.71h10.32L25.409 15.8H10.965l5.034-11.6z"/></svg>',
  styles: []
})
export class IconProductIc1Component {
  constructor() { }

  @Input() svgClass = '';
}
