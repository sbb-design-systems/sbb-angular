import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-utilization-high',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 18"><path d="M6 5H1v6h1v6h3v-6h1V5z"/><circle cx="3.5" cy="2.5" r="1.5"/><path d="M13 5H8v6h1v6h3v-6h1V5z"/><circle cx="10.5" cy="2.5" r="1.5"/><path d="M20 5h-5v6h1v6h3v-6h1V5z"/><circle cx="17.5" cy="2.5" r="1.5"/></svg>',
  styles: []
})
export class IconUtilizationHighComponent {
  constructor() { }

  @Input() svgClass = '';
}
