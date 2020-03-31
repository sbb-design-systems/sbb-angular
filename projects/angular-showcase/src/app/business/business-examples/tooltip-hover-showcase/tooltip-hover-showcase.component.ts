import { Component } from '@angular/core';
import { SbbTooltipChangeEvent } from '@sbb-esta/angular-core/base';

@Component({
  selector: 'sbb-tooltip-hover-showcase',
  templateUrl: './tooltip-hover-showcase.component.html'
})
export class TooltipHoverShowcaseComponent {
  hoverHideDelay = 0;
  hoverShowDelay = 0;

  onOpen($event: SbbTooltipChangeEvent) {
    console.log('opened', $event);
  }

  onClose($event: SbbTooltipChangeEvent) {
    console.log('closed', $event);
  }
}
