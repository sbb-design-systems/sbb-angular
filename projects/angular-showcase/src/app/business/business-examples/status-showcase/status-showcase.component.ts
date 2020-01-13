import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component } from '@angular/core';

@Component({
  selector: 'sbb-status-showcase',
  templateUrl: './status-showcase.component.html',
  styleUrls: ['./status-showcase.component.scss']
})
export class StatusShowcaseComponent {
  public rowAlignment = 'sbb-table-align-left';
  public readonly leftTooltipPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -2
  };
}
