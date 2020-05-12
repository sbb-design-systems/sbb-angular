import { Component } from '@angular/core';
import { SBB_BUSINESS_DATE_ADAPTER } from '@sbb-esta/angular-core/datetime';

@Component({
  selector: 'sbb-datepicker-business-date-adapter-example',
  templateUrl: './datepicker-business-date-adapter-example.component.html',
  providers: [SBB_BUSINESS_DATE_ADAPTER],
})
export class DatepickerBusinessDateAdapterExampleComponent {
  date: Date;
}
