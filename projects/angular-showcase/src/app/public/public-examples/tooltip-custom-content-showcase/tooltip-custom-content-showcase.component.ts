import { Component } from '@angular/core';

@Component({
  selector: 'sbb-tooltip-custom-content-showcase',
  templateUrl: './tooltip-custom-content-showcase.component.html'
})
export class TooltipCustomContentShowcaseComponent {
  onOpen($event) {
    console.log('opened', $event);
  }

  onClose($event) {
    console.log('closed', $event);
  }
}
