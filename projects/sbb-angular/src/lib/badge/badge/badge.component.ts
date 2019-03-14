import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sbb-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class BadgeComponent { 

  @Input() position: 'default' | 'top' = 'default';

}
