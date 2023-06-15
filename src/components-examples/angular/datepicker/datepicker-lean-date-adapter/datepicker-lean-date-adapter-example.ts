import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SBB_LEAN_DATE_ADAPTER } from '@sbb-esta/angular/core';
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
  providers: [SBB_LEAN_DATE_ADAPTER],
  standalone: true,
  imports: [SbbFormFieldModule, SbbDatepickerModule, SbbInputModule, FormsModule, DatePipe],
})
export class DatepickerLeanDateAdapterExample {
  date: Date;
}
