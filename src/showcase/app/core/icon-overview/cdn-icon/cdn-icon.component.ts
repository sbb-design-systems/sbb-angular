import { Component, Input } from '@angular/core';
import { Dialog } from '@sbb-esta/angular-business/dialog';

import { CdnIconDetailComponent } from '../cdn-icon-detail/cdn-icon-detail.component';
import { CdnIcon } from '../cdn-icon.service';

@Component({
  selector: 'sbb-cdn-icon',
  templateUrl: './cdn-icon.component.html',
  styleUrls: ['./cdn-icon.component.scss'],
})
export class CdnIconComponent {
  @Input() cdnIcon: CdnIcon;
  @Input() fitIcons: boolean;

  get cdnIconPath() {
    return `${this.cdnIcon.namespace}:${this.cdnIcon.name}`;
  }

  constructor(private _dialog: Dialog) {}

  openDialog() {
    this._dialog.openDialog(CdnIconDetailComponent, { data: { cdnIcon: this.cdnIcon } });
  }
}
