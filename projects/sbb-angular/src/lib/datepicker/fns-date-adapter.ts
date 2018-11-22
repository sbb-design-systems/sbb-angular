import { DateAdapter } from './date-adapter';
import * as dateFns from 'date-fns';
import * as itLocale from 'date-fns/locale/it';
import * as deLocale from 'date-fns/locale/de';
import * as frLocale from 'date-fns/locale/fr';
import { match } from '../../../../../node_modules/@types/minimatch';

const locales = {
  'it': itLocale,
  'de': deLocale,
  'fr': frLocale
};

const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

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

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}


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
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
      return range(12, i =>
        this._format(dtf, new Date(2017, i, 1)));
    }
    return DEFAULT_MONTH_NAMES[style];

  }
  getDateNames(): string[] {
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
      return range(31, i => this._format(dtf, new Date(2017, 0, i + 1)));
    }
    return DEFAULT_DATE_NAMES;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (SUPPORTS_INTL_API) {
      const dtf = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'utc' });
      return range(7, i => this._format(dtf, new Date(2017, 0, i + 1)));
    }
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
  parse(value: any): Date {

    // ^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)|[0-9]{2})\s*$
    if (value) {
   /*    const dateParts = value.trim().split('.');
      let date = null;
      if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        date = { year: toInteger(dateParts[2]), month: toInteger(dateParts[1] - 1), day: toInteger(dateParts[0]) };

      }
      return date; */
      const dateRegex = new RegExp('^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)[0-9]{2}|[0-9]{2})\s*$', 'g');
      const matches = (value as string).match(dateRegex);
      if (matches) {
        const dateParts = value.trim().split('.');
        const date = new Date(toInteger(dateParts[2]), toInteger(dateParts[1]) - 1, toInteger(dateParts[0]));
        return dateFns.parse(date);
      }
    }
    return null;
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

  /**
   * When converting Date object to string, javascript built-in functions may return wrong
   * results because it applies its internal DST rules. The DST rules around the world change
   * very frequently, and the current valid rule is not always valid in previous years though.
   * We work around this problem building a new Date object which has its internal UTC
   * representation with the local date and time.
   * @param dtf Intl.DateTimeFormat object, containg the desired string format. It must have
   *    timeZone set to 'utc' to work fine.
   * @param date Date from which we want to get the string representation according to dtf
   * @returns A Date object with its UTC representation based on the passed in date info
   */
  private _format(dtf: Intl.DateTimeFormat, date: Date) {
    const d = new Date(Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
      date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    return dtf.format(d);
  }
}

