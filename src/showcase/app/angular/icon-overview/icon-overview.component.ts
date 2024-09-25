import { Component } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CdnIcons, CdnIconService } from './cdn-icon.service';

@Component({
  selector: 'sbb-icon-overview',
  templateUrl: './icon-overview.component.html',
  styleUrls: ['./icon-overview.component.css'],
})
export class IconOverviewComponent {
  cdnIcons: Observable<CdnIcons>;

  constructor(private _iconCdnService: CdnIconService) {
    this.cdnIcons = forkJoin([
      _iconCdnService.loadDeprecated(),
      _iconCdnService.loadIcons(),
      _iconCdnService.loadPictos(),
    ]).pipe(
      map(([deprecated, icons, pictos]) => ({
        deprecatedVersion: deprecated.version,
        iconVersion: icons.version,
        pictoVersion: pictos.version,
        icons: icons.icons.concat(deprecated.icons, pictos.icons),
      })),
    );
  }
}
