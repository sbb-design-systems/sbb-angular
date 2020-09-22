import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbSidebarLink]',
  templateUrl: './sidebar-link.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-sidebar-link',
  },
})
export class SbbSidebarLink {}
