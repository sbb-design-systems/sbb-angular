import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideLeanDateAdapter } from '@sbb-esta/angular/core';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Datepicker Lean Date Adapter
 * @order 50
 */
@Component({
  selector: 'sbb-datepicker-lean-date-adapter-example',
  templateUrl: 'datepicker-lean-date-adapter-example.html',
  providers: [provideLeanDateAdapter()],
  imports: [SbbFormFieldModule, SbbDatepickerModule, SbbInputModule, FormsModule, DatePipe],
})
export class DatepickerLeanDateAdapterExample {
  date: Date;
}
