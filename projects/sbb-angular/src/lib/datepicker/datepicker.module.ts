import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DatepickerEmbeddableComponent,
  SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './datepicker-embeddable/datepicker-embeddable.component';
import {
  IconCommonModule,
  IconArrowSmallRightComponent,
  IconArrowSmallLeftComponent,
  IconCalendarComponent
} from '../svg-icons-components';
import { ButtonModule } from '../button';
import { DatepickerToggleComponent } from './datepicker-toggle/datepicker-toggle.component';
import { DatepickerContentComponent } from './datepicker-content/datepicker-content.component';
import { CalendarComponent, CalendarHeaderComponent } from './calendar/calendar.component';
import { MonthViewComponent } from './month-view/month-view.component';
import { CalendarBodyComponent } from './calendar-body/calendar-body.component';
import { DatepickerInputDirective } from './datepicker-input/datepicker-input.directive';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { DatepickerIntlService } from './datepicker-intl.service';
import { DateAdapter } from './date-adapter';
import { FnsDateAdapter } from './fns-date-adapter';
import { SBB_DATE_FORMATS } from './date-formats';
import { FNS_DATE_FORMATS } from './fns-date-formats';
import { DatepickerComponent } from './datepicker/datepicker.component';


@NgModule({
  imports: [
    CommonModule,
    IconCommonModule,
    ButtonModule,
    PortalModule,
    A11yModule,
    OverlayModule
  ],
  declarations: [
    DatepickerEmbeddableComponent,
    DatepickerToggleComponent,
    DatepickerContentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MonthViewComponent,
    CalendarBodyComponent,
    DatepickerInputDirective,
    DatepickerComponent,

  ],
  exports: [
    DatepickerEmbeddableComponent,
    DatepickerToggleComponent,
    DatepickerContentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MonthViewComponent,
    CalendarBodyComponent,
    DatepickerInputDirective,
    DatepickerComponent
  ],
  providers: [
    DatepickerIntlService,
    SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    { provide: DateAdapter, useClass: FnsDateAdapter },
    { provide: SBB_DATE_FORMATS, useValue: FNS_DATE_FORMATS }
  ],
  entryComponents: [
    DatepickerContentComponent,
    CalendarHeaderComponent,
    IconArrowSmallRightComponent,
    IconArrowSmallLeftComponent,
    IconCalendarComponent
  ]

})
export class DatepickerModule { }
