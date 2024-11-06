import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

/**
 * @title Tooltip Custom Content
 * @order 30
 */
@Component({
  selector: 'sbb-tooltip-custom-content-example',
  templateUrl: 'tooltip-custom-content-example.html',
  imports: [SbbTooltipModule, SbbButtonModule],
})
export class TooltipCustomContentExample {}
