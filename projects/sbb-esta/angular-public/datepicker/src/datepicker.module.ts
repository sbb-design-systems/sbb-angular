import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DATE_PIPE_DATE_FORMATS,
  DateAdapter,
  NativeDateAdapter,
  SBB_DATE_FORMATS
} from '@sbb-esta/angular-core/datetime';
import {
  IconCalendarModule,
  IconChevronSmallLeftModule,
  IconChevronSmallRightModule
} from '@sbb-esta/angular-icons';

import { CalendarBodyComponent } from './calendar-body/calendar-body.component';
import { CalendarComponent, CalendarHeaderComponent } from './calendar/calendar.component';
import { DateInputDirective } from './date-input/date-input.directive';
import { DatepickerContentComponent } from './datepicker-content/datepicker-content.component';
import { DatepickerToggleComponent } from './datepicker-toggle/datepicker-toggle.component';
import {
  DatepickerComponent,
  SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './datepicker/datepicker.component';
import { MonthViewComponent } from './month-view/month-view.component';

@NgModule({
  imports: [
    CommonModule,
    IconChevronSmallLeftModule,
    IconChevronSmallRightModule,
    IconCalendarModule,
    PortalModule,
    A11yModule,
    OverlayModule
  ],
  declarations: [
    DatepickerComponent,
    DatepickerToggleComponent,
    DatepickerContentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MonthViewComponent,
    CalendarBodyComponent,
    DateInputDirective
  ],
  exports: [
    DatepickerComponent,
    DatepickerToggleComponent,
    DatepickerContentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MonthViewComponent,
    CalendarBodyComponent,
    DateInputDirective
  ],
  providers: [
    SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: SBB_DATE_FORMATS, useValue: DATE_PIPE_DATE_FORMATS }
  ],
  entryComponents: [DatepickerContentComponent, CalendarHeaderComponent]
})
export class DatepickerModule {}
