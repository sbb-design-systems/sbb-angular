import { Component } from '@angular/core';

@Component({
  selector: 'sbb-tooltip-hover-showcase',
  templateUrl: './tooltip-hover-showcase.component.html'
})
export class TooltipHoverShowcaseComponent {
  hoverHideDelay = 0;
  hoverShowDelay = 0;

  onOpen($event) {
    console.log('opened', $event);
  }

  onClose($event) {
    console.log('closed', $event);
  }
}
