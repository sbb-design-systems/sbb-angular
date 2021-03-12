import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Time Input Reactive Forms
 * @order 20
 */
@Component({
  selector: 'sbb-time-input-reactive-forms-example',
  templateUrl: './time-input-reactive-forms-example.html',
})
export class TimeInputReactiveFormsExample {
  formControl = new FormControl('');
}
