import { Component } from '@angular/core';

@Component({
  selector: 'sbb-tooltip-simple-showcase',
  templateUrl: './tooltip-simple-showcase.component.html'
})
export class TooltipSimpleShowcaseComponent {
  tooltipContent = 'Tooltip text content';

  onOpen($event) {
    console.log('opened', $event);
  }

  onClose($event) {
    console.log('closed', $event);
  }
}
