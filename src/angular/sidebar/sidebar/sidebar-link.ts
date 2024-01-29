import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';

@Component({
  selector: 'a[sbbSidebarLink]',
  templateUrl: './sidebar-link.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-sidebar-link',
  },
  standalone: true,
  imports: [SbbIcon],
})
export class SbbSidebarLink {}
