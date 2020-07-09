import { Component, Input } from '@angular/core';
import { Dialog } from '@sbb-esta/angular-business/dialog';

import { CdnIcon } from '../../cdn-icon.service';
import { CdnIconDialogComponent } from '../cdn-icon-detail/cdn-icon-detail.component';

@Component({
  selector: 'sbb-cdn-icon',
  templateUrl: './cdn-icon.component.html',
  styleUrls: ['./cdn-icon.component.scss'],
})
export class CdnIconComponent {
  @Input() cdnIcon: CdnIcon;

  get cdnIconPath() {
    return `${this.cdnIcon.namespace}:${this.cdnIcon.name}`;
  }

  constructor(private _dialog: Dialog) {}

  openDialog() {
    this._dialog.openDialog(CdnIconDialogComponent, { data: { cdnIcon: this.cdnIcon } });
  }
}
