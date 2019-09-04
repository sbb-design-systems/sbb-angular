import { InjectionToken } from '@angular/core';

export interface DateFormats {
  dateInput: any;
  dateA11yLabel: any;
}

export const SBB_DATE_FORMATS = new InjectionToken<DateFormats>('sbb-date-formats');
