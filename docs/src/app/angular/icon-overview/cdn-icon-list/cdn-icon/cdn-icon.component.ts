import { Component, Input } from '@angular/core';
import { SbbDialog } from '@sbb-esta/angular/dialog';

import { CdnIcon } from '../../cdn-icon.service';
import { CdnIconDialogComponent } from '../cdn-icon-dialog/cdn-icon-dialog.component';

@Component({
  selector: 'sbb-cdn-icon',
  templateUrl: './cdn-icon.component.html',
  styleUrls: ['./cdn-icon.component.scss'],
  standalone: false,
})
export class CdnIconComponent {
  @Input() cdnIcon: CdnIcon;

  get cdnIconPath() {
    return this.cdnIcon.namespace
      ? `${this.cdnIcon.namespace}:${this.cdnIcon.name}`
      : this.cdnIcon.name;
  }

  constructor(private _dialog: SbbDialog) {}

  openDialog() {
    this._dialog.open(CdnIconDialogComponent, {
      data: { cdnIcon: this.cdnIcon },
      minWidth: 420,
    });
  }
}
