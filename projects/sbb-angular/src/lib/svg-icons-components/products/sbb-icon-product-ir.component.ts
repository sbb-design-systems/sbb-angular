import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-product-ir',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 20"><path d="M9.249 4.2h4.07L8.284 15.8H4.197zM26.066 12.366c.368 0 .7-.217.85-.553L30.218 4.2H16.036L11 15.8h4.052l3.811-8.69h6.014l-1.205 2.775-5.244-.019L22.66 15.8h4.613l-3.134-3.434h1.927z"/></svg>',
  styles: []
})
export class IconProductIrComponent {
  constructor() { }

  @Input() svgClass = '';
}
