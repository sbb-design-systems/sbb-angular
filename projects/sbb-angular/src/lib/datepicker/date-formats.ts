import { InjectionToken } from '@angular/core';


export interface DateFormats {
    parse: {
        dateInput: any
    };
    display: {
        monthLabel: any,
        dateInput: any,
        yearLabel: any,
        dateA11yLabel: any,
        monthA11yLabel: any,
        yearA11yLabel: any
    };
}


export const SBB_DATE_FORMATS = new InjectionToken<DateFormats>('sbb-date-formats');
