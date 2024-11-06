import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Datepicker Standalone Forms
 * @order 40
 */
@Component({
  selector: 'sbb-datepicker-standalone-forms-example',
  templateUrl: 'datepicker-standalone-forms-example.html',
  imports: [SbbFormFieldModule, SbbDatepickerModule, SbbInputModule, FormsModule, DatePipe],
})
export class DatepickerStandaloneFormsExample {
  date: Date;
}
