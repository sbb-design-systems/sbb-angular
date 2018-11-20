import { InjectionToken } from '@angular/core';


export interface DateFormats {
    parse: {
        dateInput: any
    };
    display: {
        dateInput: any,
        monthYearLabel: any,
        dateA11yLabel: any,
        monthYearA11yLabel: any,
    };
}


export const SBB_DATE_FORMATS = new InjectionToken<DateFormats>('sbb-date-formats');
