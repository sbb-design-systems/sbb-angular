import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbb-usermenu-item], button[sbb-usermenu-item]',
  templateUrl: './usermenu-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-usermenu-item',
  },
})
export class SbbUsermenuItem {}
