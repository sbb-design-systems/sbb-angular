import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-product-ic-7',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 20"><path d="M44.499 4.235v1.962c-.064.069-.25.282-.562.64-.432.496-.862 1.12-1.29 1.872-.426.751-.759 1.472-.996 2.163-.501 1.44-.804 3.082-.91 4.928h-2.389c.016-.87.168-1.835.455-2.895.288-1.06.684-2.12 1.19-3.18.723-1.498 1.456-2.613 2.2-3.346h-5.458V4.235h7.76zM9.252 4.2h4.07L8.287 15.8H4.2zM16.002 4.2h14.444L28.95 7.645H18.635l-2.048 4.71h10.32L25.412 15.8H10.968l5.034-11.6z"/></svg>',
  styles: []
})
export class IconProductIc7Component {
  constructor() { }

  @Input() svgClass = '';
}
