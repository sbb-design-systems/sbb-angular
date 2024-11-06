import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTimeInputModule } from '@sbb-esta/angular/time-input';

/**
 * @title Time Input Forms
 * @order 30
 */
@Component({
  selector: 'sbb-time-input-forms-example',
  templateUrl: 'time-input-forms-example.html',
  imports: [SbbFormFieldModule, SbbTimeInputModule, SbbInputModule, FormsModule],
})
export class TimeInputFormsExample {
  value = '01:23';
}
