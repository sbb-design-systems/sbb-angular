import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbIconSidebarItem]',
  templateUrl: './icon-sidebar-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-icon-sidebar-item',
    '[title]': 'label',
  },
})
export class SbbIconSidebarItem {
  /**
   * Label of the icon
   */
  @Input()
  label: string;
}
