import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-trainformation-business-zone',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4.914 11.25h1.024c1.322 0 2.756-.372 2.756-1.899 0-1.247-1.192-1.303-2.18-1.303h-.912l-.688 3.202zm-1.191 5.698h.893c1.602 0 3.389-.187 3.389-2.198 0-1.359-1.268-1.564-2.662-1.564h-.838l-.782 3.762zM3.517 6h3.855c2.03 0 3.928.745 3.928 3.109 0 1.582-1.266 2.848-2.775 3.09v.038c1.453.223 2.086 1.34 2.086 2.736 0 3.724-4.171 4.022-6.106 4.022H.8L3.517 6zm10.761 0H23.2l-.448 2.049-7.84 8.903h5.921l-.428 2.047H11.28l.41-2.047 7.821-8.903h-5.68"/></svg>',
  styles: []
})
export class IconTrainformationBusinessZoneComponent {
  constructor() { }

  @Input() svgClass = '';
}
