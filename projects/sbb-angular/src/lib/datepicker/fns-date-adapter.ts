import { DateAdapter } from './date-adapter';
import * as dateFns from 'date-fns';
import * as itLocale from 'date-fns/locale/it';
import * as deLocale from 'date-fns/locale/de';
import * as frLocale from 'date-fns/locale/fr';

const locales = {
    'it': itLocale,
    'de': deLocale,
    'fr': frLocale
};

/** The default month names to use if Intl API is not available. */
const DEFAULT_MONTH_NAMES = {
    'long': [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ],
    'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

/** The default date names to use if Intl API is not available. */
const DEFAULT_DATE_NAMES = range(31, i => String(i + 1));


/** The default day of the week names to use if Intl API is not available. */
const DEFAULT_DAY_OF_WEEK_NAMES = {
    'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};


export class FnsDateAdapter extends DateAdapter<Date> {
    protected locale: any;
    localeChanges;
    protected _localeChanges;

    getYear(date: Date): number {
        return dateFns.getYear(date);
    }
    getMonth(date: Date): number {
        return dateFns.getMonth(date);
    }
    getDate(date: Date): number {
        return dateFns.getDate(date);
    }
    getDayOfWeek(date: Date): number {
        return dateFns.getDay(date);
    }
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return DEFAULT_MONTH_NAMES[style];

    }
    getDateNames(): string[] {
        return DEFAULT_DATE_NAMES;
    }
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }
    getYearName(date: Date): string {
        return String(dateFns.getYear(date));
    }
    getFirstDayOfWeek(): number {
        return 0;
    }
    getNumDaysInMonth(date: Date): number {
        return dateFns.getDaysInMonth(date);
    }
    clone(date: Date): Date {
        return dateFns.parse(date);
    }
    createDate(year: number, month: number, date: number): Date {
        return dateFns.parse(new Date(year, month, date));
    }
    today(): Date {
        return dateFns.startOfToday();
    }
    parse(value: any, parseFormat: any): Date {
        return dateFns.parse(value, parseFormat);
    }
    format(date: Date, displayFormat: any): string {
        return dateFns.format(date, displayFormat, { locale: locales[this.locale] });
    }
    addCalendarYears(date: Date, years: number): Date {
        return dateFns.addYears(date, years);
    }
    addCalendarMonths(date: Date, months: number): Date {
        return dateFns.addMonths(date, months);
    }
    addCalendarDays(date: Date, days: number): Date {
        return dateFns.addDays(date, days);
    }

    /**
      * Pads a number to make it two digits.
      * @param n The number to pad.
      * @returns The padded number.
      */
    private _2digit(n: number) {
        return ('00' + n).slice(-2);
    }

    toIso8601(date: Date): string {
        return [
            date.getUTCFullYear(),
            this._2digit(date.getUTCMonth() + 1),
            this._2digit(date.getUTCDate())
        ].join('-');
    }
    isDateInstance(obj: any): boolean {
        return dateFns.isDate(obj);
    }
    isValid(date: Date): boolean {
        return dateFns.isValid(date);
    }
    invalid(): Date {
        return new Date(NaN);
    }


}

