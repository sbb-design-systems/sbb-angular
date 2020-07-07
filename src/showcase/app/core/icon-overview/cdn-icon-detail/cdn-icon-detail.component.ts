import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@sbb-esta/angular-business/dialog';

@Component({
  selector: 'sbb-cdn-icon-detail',
  templateUrl: './cdn-icon-detail.component.html',
  styleUrls: ['./cdn-icon-detail.component.scss'],
})
export class CdnIconDetailComponent {
  constructor(@Inject(DIALOG_DATA) public data: { path: string }) {}

  get path(): string {
    return this.data.path;
  }
}
