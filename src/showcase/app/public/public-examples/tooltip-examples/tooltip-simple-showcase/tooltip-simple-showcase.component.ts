import { Component } from '@angular/core';
import { SbbTooltipChangeEvent } from '@sbb-esta/angular-core/base';

@Component({
  selector: 'sbb-tooltip-simple-showcase',
  templateUrl: './tooltip-simple-showcase.component.html'
})
export class TooltipSimpleShowcaseComponent {
  tooltipContent = 'Tooltip text content';

  onOpen($event: SbbTooltipChangeEvent) {
    console.log('opened', $event);
  }

  onClose($event: SbbTooltipChangeEvent) {
    console.log('closed', $event);
  }
}
