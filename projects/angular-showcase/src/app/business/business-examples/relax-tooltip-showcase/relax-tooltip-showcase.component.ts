import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component } from '@angular/core';

@Component({
  selector: 'sbb-relax-tooltip-showcase',
  templateUrl: './relax-tooltip-showcase.component.html',
  styleUrls: ['./relax-tooltip-showcase.component.scss']
})
export class RelaxTooltipShowcaseComponent {
  public readonly leftTooltipPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -2
  };
}
