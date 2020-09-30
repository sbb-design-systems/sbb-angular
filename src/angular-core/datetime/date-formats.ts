import { InjectionToken } from '@angular/core';

export interface SbbDateFormats {
  dateInput: any;
  dateA11yLabel: any;
}

export const SBB_DATE_FORMATS = new InjectionToken<SbbDateFormats>('sbb-date-formats');
