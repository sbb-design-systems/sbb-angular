import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-trainformation-lokomotive-small',
  // tslint:disable-next-line:max-line-length
  template: '<svg [attr.class]="svgClass + commonClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#767676" d="M20 6v12H9.762s-6.34 0-4.39-5l2.399-5.027C8.894 5.953 10.805 6 10.805 6H20zm-8.775 6.5h1.951v-4h-1.95v4zm-.487 0v-4H8.787l-1.951 4h3.902z"/></svg>',
  styles: []
})
export class IconTrainformationLokomotiveSmallComponent {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ';
}
