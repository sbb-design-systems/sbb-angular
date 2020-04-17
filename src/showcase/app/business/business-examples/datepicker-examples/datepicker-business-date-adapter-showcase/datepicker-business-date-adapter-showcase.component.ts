import { Component } from '@angular/core';
import { SBB_BUSINESS_DATE_ADAPTER } from '@sbb-esta/angular-core';

@Component({
  selector: 'sbb-datepicker-business-date-adapter-showcase',
  templateUrl: './datepicker-business-date-adapter-showcase.component.html',
  providers: [SBB_BUSINESS_DATE_ADAPTER]
})
export class DatepickerBusinessDateAdapterShowcaseComponent {
  date: Date;
}
