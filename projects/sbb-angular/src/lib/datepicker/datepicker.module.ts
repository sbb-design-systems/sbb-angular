import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DatepickerEmbeddableComponent,
  SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './datepicker-embeddable/datepicker-embeddable.component';
import {
  IconCommonModule
} from '../svg-icons-components/index';
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
import { NativeDateAdapter } from './native-date-adapter';
import { SBB_DATE_FORMATS } from './date-formats';
import { DATE_PIPE_DATE_FORMATS } from './date-pipe-date-formats';
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule,
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
    DatepickerComponent
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
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: SBB_DATE_FORMATS, useValue: DATE_PIPE_DATE_FORMATS }
  ],
  entryComponents: [
    DatepickerContentComponent,
    CalendarHeaderComponent
  ]
})
export class DatepickerModule { }
