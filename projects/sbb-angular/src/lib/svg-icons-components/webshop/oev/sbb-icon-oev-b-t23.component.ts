import { Component, Input } from '@angular/core';
@Component({
  selector: 'sbb-icon-oev-b-t23',
  // tslint:disable-next-line:max-line-length
  template: '<svg [class]="svgClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g><path d="M15.6 4.677l1.908.318v.57L15.6 5.248v-.571zM14.412 4.478v.571L2.492 3.063v-.572l11.92 1.987z"/><path d="M13.13 13.442v-3.128c0-.173.138-.314.311-.314h3.13c.171 0 .311.14.311.314v3.128c0 .173-.14.312-.312.312h-3.129a.311.311 0 0 1-.312-.312zm0-4.068a.626.626 0 0 0-.627.626v3.63c0 .082.008.164.025.245l.625 3.13a.626.626 0 0 0 .614.503h2.478c.298 0 .556-.21.613-.503l.626-3.13c.016-.081.024-.162.024-.245V10a.626.626 0 0 0-.626-.626h-1.595V3.93h-.564v5.443H13.13z"/></g></svg>',
  styles: []
})
export class IconOevBT23Component {
  constructor() { }

  @Input() svgClass = '';
}
