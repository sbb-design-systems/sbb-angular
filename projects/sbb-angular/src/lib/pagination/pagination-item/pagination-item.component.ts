import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'sbb-pagination-item',
  templateUrl: './pagination-item.component.html',
  styleUrls: ['./pagination-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationItemComponent {

  @Input()
  mode: 'link' | 'button' = 'button';

  @Input()
  tabindex = 0;
}
