import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent, SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from './datepicker/datepicker.component';
import { IconCommonModule } from '../svg-icons-components';
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
    DatepickerComponent,
    DatepickerToggleComponent,
    DatepickerContentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MonthViewComponent,
    CalendarBodyComponent,
    DatepickerInputDirective
  ],
  exports: [
    DatepickerComponent,
    DatepickerToggleComponent,
    DatepickerContentComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    MonthViewComponent,
    CalendarBodyComponent,
    DatepickerInputDirective
  ],
  providers: [SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER]

})
export class DatepickerModule { }
