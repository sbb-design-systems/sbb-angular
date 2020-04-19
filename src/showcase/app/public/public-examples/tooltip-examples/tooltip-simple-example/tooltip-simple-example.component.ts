import { Component } from '@angular/core';
import { SbbTooltipChangeEvent } from '@sbb-esta/angular-public/tooltip';

@Component({
  selector: 'sbb-tooltip-simple-example',
  templateUrl: './tooltip-simple-example.component.html'
})
export class TooltipSimpleExampleComponent {
  tooltipContent = 'Tooltip text content';

  onOpen($event: SbbTooltipChangeEvent) {
    console.log('opened', $event);
  }

  onClose($event: SbbTooltipChangeEvent) {
    console.log('closed', $event);
  }
}
