import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SbbDateAdapter,
  SbbNativeDateAdapter,
  SBB_DATE_FORMATS,
  SBB_DATE_PIPE_DATE_FORMATS,
} from '@sbb-esta/angular-core/datetime';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbCalendarBody } from './calendar-body/calendar-body.component';
import { SbbCalendar, SbbCalendarHeader } from './calendar/calendar.component';
import { SbbDateInput } from './date-input/date-input.directive';
import { SbbDatepickerContent } from './datepicker-content/datepicker-content.component';
import { SbbDatepickerToggle } from './datepicker-toggle/datepicker-toggle.component';
import {
  SbbDatepicker,
  SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datepicker/datepicker.component';
import { SbbMonthView } from './month-view/month-view.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, PortalModule, A11yModule, OverlayModule],
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
  providers: [
    SBB_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    { provide: SbbDateAdapter, useClass: SbbNativeDateAdapter },
    { provide: SBB_DATE_FORMATS, useValue: SBB_DATE_PIPE_DATE_FORMATS },
    ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER,
  ],
  entryComponents: [SbbDatepickerContent, SbbCalendarHeader],
})
export class SbbDatepickerModule {}
