import { Component, Input } from '@angular/core';

import { CdnIcons } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-list',
  templateUrl: './cdn-icon-list.component.html',
  styleUrls: ['./cdn-icon-list.component.scss'],
})
export class CdnIconListComponent {
  @Input() cdnIcons: CdnIcons;
}
