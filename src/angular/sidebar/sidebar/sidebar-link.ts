import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'a[sbbSidebarLink]',
  templateUrl: './sidebar-link.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-sidebar-link sbb-alternative-link',
  },
})
export class SbbSidebarLink {}
