import { Component } from '@angular/core';
import { SbbTooltipChangeEvent } from '@sbb-esta/angular-business/tooltip';

@Component({
  selector: 'sbb-tooltip-hover-example',
  templateUrl: './tooltip-hover-example.component.html'
})
export class TooltipHoverExampleComponent {
  hoverHideDelay = 0;
  hoverShowDelay = 0;

  onOpen($event: SbbTooltipChangeEvent) {
    console.log('opened', $event);
  }

  onClose($event: SbbTooltipChangeEvent) {
    console.log('closed', $event);
  }
}
