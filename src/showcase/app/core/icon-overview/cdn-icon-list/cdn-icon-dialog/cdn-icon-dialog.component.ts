import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@sbb-esta/angular-business/dialog';

import { CdnIcon } from '../../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon-dialog',
  templateUrl: './cdn-icon-dialog.component.html',
  styleUrls: ['./cdn-icon-dialog.component.scss'],
})
export class CdnIconDialogComponent {
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
