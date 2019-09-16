import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-tooltip-showcase',
  templateUrl: './tooltip-showcase.component.html',
  styleUrls: ['./tooltip-showcase.component.scss']
})
export class TooltipShowcaseComponent {
  tooltipContent = 'Tooltip-Inhalt';
  hoverCloseDelay = 0;
  hoverOpenDelay = 0;

  onOpen($event) {
    console.log('opened', $event);
  }

  onClose($event) {
    console.log('closed', $event);
  }
}
