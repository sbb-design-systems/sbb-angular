import { Component } from '@angular/core';
import { SBB_BUSINESS_DATE_ADAPTER } from '@sbb-esta/angular/core';

/**
 * @title Datepicker Lean Date Adapter
 * @order 50
 */
@Component({
  selector: 'sbb-datepicker-business-date-adapter-example',
  templateUrl: './datepicker-business-date-adapter-example.html',
  providers: [SBB_BUSINESS_DATE_ADAPTER],
})
export class DatepickerBusinessDateAdapterExample {
  date: Date;
}
