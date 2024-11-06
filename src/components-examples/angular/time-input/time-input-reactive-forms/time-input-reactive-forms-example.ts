import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTimeInputModule } from '@sbb-esta/angular/time-input';

/**
 * @title Time Input Reactive Forms
 * @order 20
 */
@Component({
  selector: 'sbb-time-input-reactive-forms-example',
  templateUrl: 'time-input-reactive-forms-example.html',
  imports: [
    SbbFormFieldModule,
    SbbTimeInputModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
  ],
})
export class TimeInputReactiveFormsExample {
  formControl = new FormControl('');
  readonly = new FormControl(false);
}
