import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sbb-pagination-item',
  templateUrl: './pagination-item.component.html',
  styleUrls: ['./pagination-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationItemComponent {

  @Input()
  mode: 'link' | 'button' = 'button';

}
