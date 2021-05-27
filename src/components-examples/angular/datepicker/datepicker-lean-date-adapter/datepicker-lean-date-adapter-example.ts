import { Component } from '@angular/core';
import { SBB_LEAN_DATE_ADAPTER } from '@sbb-esta/angular/core';

/**
 * @title Datepicker Lean Date Adapter
 * @order 50
 */
@Component({
  selector: 'sbb-datepicker-lean-date-adapter-example',
  templateUrl: './datepicker-lean-date-adapter-example.html',
  providers: [SBB_LEAN_DATE_ADAPTER],
})
export class DatepickerLeanDateAdapterExample {
  date: Date;
}
