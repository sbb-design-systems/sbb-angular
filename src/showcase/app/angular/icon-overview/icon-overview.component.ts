import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CdnIcons, CdnIconService } from './cdn-icon.service';

@Component({
  selector: 'sbb-icon-overview',
  templateUrl: './icon-overview.component.html',
  styleUrls: ['./icon-overview.component.css'],
})
export class IconOverviewComponent {
  cdnIcons: Observable<CdnIcons>;

  constructor(private _iconCdnService: CdnIconService) {
    this.cdnIcons = _iconCdnService.loadAll();
  }
}
