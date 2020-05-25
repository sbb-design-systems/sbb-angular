import { Component } from '@angular/core';
import { SbbTooltipChangeEvent } from '@sbb-esta/angular-business/tooltip';

@Component({
  selector: 'sbb-tooltip-custom-content-example',
  templateUrl: './tooltip-custom-content-example.component.html',
})
export class TooltipCustomContentExampleComponent {
  onOpen($event: SbbTooltipChangeEvent) {
    console.log('opened', $event);
  }

  onClose($event: SbbTooltipChangeEvent) {
    console.log('closed', $event);
  }
}
