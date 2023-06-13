import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

/**
 * @title Tooltip Simple
 * @order 10
 */
@Component({
  selector: 'sbb-tooltip-simple-example',
  templateUrl: 'tooltip-simple-example.html',
  standalone: true,
  imports: [SbbTooltipModule, SbbFormFieldModule, SbbInputModule, FormsModule],
})
export class TooltipSimpleExample {
  tooltipContent = 'Tooltip text content';
}
