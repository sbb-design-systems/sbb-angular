import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@sbb-esta/angular-business/dialog';

import { CdnIcon } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-detail',
  templateUrl: './cdn-icon-detail.component.html',
  styleUrls: ['./cdn-icon-detail.component.scss'],
})
export class CdnIconDetailComponent {
  constructor(@Inject(DIALOG_DATA) public data: { cdnIcon: CdnIcon }) {}

  get cdnIcon(): CdnIcon {
    return this.data.cdnIcon;
  }

  get tags(): string {
    return this.cdnIcon.tags.join(', ');
  }

  get cdnIconPath() {
    return `${this.cdnIcon.namespace}:${this.cdnIcon.name}`;
  }
}
