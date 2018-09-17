import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-trainformation-family-zone',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.491 6l-.445 2.049h5.679l-7.822 8.902L10.494 19h9.125l.43-2.049h-5.924l7.84-8.902L22.414 6H13.49zM4.738 6L2 19h2.607l1.194-5.7h4.358l.408-2.048h-4.34l.69-3.203h4.544L11.908 6h-7.17z"/></svg>',
  styles: []
})
export class IconTrainformationFamilyZoneComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
