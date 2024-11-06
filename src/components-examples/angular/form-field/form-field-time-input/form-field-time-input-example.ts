import { Component } from '@angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTimeInputModule } from '@sbb-esta/angular/time-input';

/**
 * @title Form Field Time Input
 * @order 60
 */
@Component({
  selector: 'sbb-form-field-time-input-example',
  templateUrl: 'form-field-time-input-example.html',
  imports: [SbbFormFieldModule, SbbInputModule, SbbTimeInputModule],
})
export class FormFieldTimeInputExample {}
