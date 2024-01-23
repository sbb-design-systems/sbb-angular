import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideNativeDateAdapter } from '@sbb-esta/angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbCalendarBody } from './calendar-body/calendar-body';
import { SbbCalendar, SbbCalendarHeader } from './calendar/calendar';
import { SbbDateInput } from './date-input/date-input.directive';
import { SbbDatepickerContent } from './datepicker-content/datepicker-content';
import { SbbDatepickerToggle } from './datepicker-toggle/datepicker-toggle';
import {
  SbbDatepicker,
  SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datepicker/datepicker';
import { SbbMonthView } from './month-view/month-view';

@NgModule({
  imports: [CommonModule, PortalModule, A11yModule, OverlayModule, SbbCommonModule, SbbIconModule],
  declarations: [
    SbbDatepicker,
    SbbDatepickerToggle,
    SbbDatepickerContent,
    SbbCalendar,
    SbbCalendarHeader,
    SbbMonthView,
    SbbCalendarBody,
    SbbDateInput,
  ],
  exports: [
    SbbDatepicker,
    SbbDatepickerToggle,
    SbbDatepickerContent,
    SbbCalendar,
    SbbCalendarHeader,
    SbbMonthView,
    SbbCalendarBody,
    SbbDateInput,
  ],
  providers: [SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, provideNativeDateAdapter()],
})
export class SbbDatepickerModule {}
