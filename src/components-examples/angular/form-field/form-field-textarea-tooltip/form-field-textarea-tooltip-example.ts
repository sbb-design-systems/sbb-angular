import { Component } from '@angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

/**
 * @title Form Field Textarea Tooltip
 * @order 70
 */
@Component({
  selector: 'sbb-form-field-textarea-tooltip-example',
  templateUrl: 'form-field-textarea-tooltip-example.html',
  imports: [SbbFormFieldModule, SbbTooltipModule, SbbInputModule],
})
export class FormFieldTextareaTooltipExample {}
