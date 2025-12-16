// tslint:disable:require-property-typedef
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SbbLoadingIndicator } from '@sbb-esta/angular/loading-indicator';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { CdnIconListComponent } from './cdn-icon-list/cdn-icon-list.component';
import { CdnIconService } from './cdn-icon.service';

@Component({
  selector: 'sbb-icon-overview',
  templateUrl: './icon-overview.component.html',
  styleUrls: ['./icon-overview.component.scss'],
  imports: [CdnIconListComponent, SbbLoadingIndicator, ScrollingModule],
})
export class IconOverviewComponent {
  private _iconCdnService = inject(CdnIconService);
  cdnIcons = toSignal(
    forkJoin([
      this._iconCdnService.loadDeprecated(),
      this._iconCdnService.loadIcons(),
      this._iconCdnService.loadPictos(),
    ]).pipe(
      map(([deprecated, icons, pictos]) => ({
        deprecatedVersion: deprecated.version,
        iconVersion: icons.version,
        pictoVersion: pictos.version,
        icons: icons.icons.concat(deprecated.icons, pictos.icons),
      })),
    ),
  );
}
