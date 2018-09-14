import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-trainformation-sleeping-car',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 17h-1.313v-3.15H6.313V17H5V8h.6c.3 0 .676.172 1.13.52.456.346.848.749 1.179 1.209.329.462.576.914.74 1.359.166.445.25.915.25 1.412h1.303c0-.984.317-1.874.951-2.52.634-.647 1.412-1.119 2.331-1.08H19V17"/></svg>',
  styles: []
})
export class IconTrainformationSleepingCarComponent {
  constructor() { }

  @Input() svgClass = '';
}
