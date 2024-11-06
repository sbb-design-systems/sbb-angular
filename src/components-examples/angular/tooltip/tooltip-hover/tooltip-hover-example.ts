import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

/**
 * @title Tooltip Hover
 * @order 40
 */
@Component({
  selector: 'sbb-tooltip-hover-example',
  templateUrl: 'tooltip-hover-example.html',
  imports: [SbbTooltipModule, SbbFormFieldModule, SbbInputModule, FormsModule],
})
export class TooltipHoverExample {
  hoverHideDelay = 0;
  hoverShowDelay = 0;
}
