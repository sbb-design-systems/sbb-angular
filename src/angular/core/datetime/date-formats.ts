import { InjectionToken } from '@angular/core';

export interface SbbDateFormats {
  dateInput: any;
  /**
   * Parameter `dateInputPure` will become required.
   * @breaking-change 15.0.0
   */
  dateInputPure?: any;
  dateA11yLabel: any;
}

export const SBB_DATE_FORMATS = new InjectionToken<SbbDateFormats>('sbb-date-formats');
