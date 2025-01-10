import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'a[sbbIconSidebarItem]',
  templateUrl: './icon-sidebar-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-icon-sidebar-item sbb-icon-scaled',
  },
})
export class SbbIconSidebarItem {
  /** Label of the icon */
  @Input()
  label: string;
}
