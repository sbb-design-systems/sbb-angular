import { DatePipe, TitleCasePipe } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';

import { DateAdapter } from './date-adapter';
import { SBB_DATEPICKER_2DIGIT_YEAR_PIVOT } from './datepicker-token';

/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings an with out of bounds month, date, etc.
 */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

@Injectable()
export class NativeDateAdapter extends DateAdapter<Date> {
  private _datePipe: DatePipe;
  private _yearPivot: number;
  private _titleCasePipe = new TitleCasePipe();

  constructor(
    @Inject(LOCALE_ID) protected _locale: string,
    @Optional() @Inject(SBB_DATEPICKER_2DIGIT_YEAR_PIVOT) yearPivot: number
  ) {
    super();
    this._datePipe = new DatePipe(_locale);
    this._yearPivot = typeof yearPivot === 'number' ? yearPivot : new Date().getFullYear() - 1975;
  }

  getYear(date: Date): number {
    return date.getFullYear();
  }

  getMonth(date: Date): number {
    return date.getMonth();
  }

  getDate(date: Date): number {
    return date.getDate();
  }

  getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  getMonthName(date: Date) {
    return this._datePipe.transform(date, 'LLLL');
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    let format;
    switch (style) {
      case 'long':
        format = 'LLLL';
        break;
      case 'narrow':
        format = 'LLLLL';
        break;
      default:
        format = 'LLL';
        break;
    }
    return range(12, i => this._datePipe.transform(new Date(2017, i, 1), format));
  }

  getDateNames(): string[] {
    return range(31, i => this._datePipe.transform(new Date(2017, 0, i + 1), 'd'));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    let format;
    switch (style) {
      case 'long':
        format = 'EEEE';
        break;
      case 'narrow':
        format = 'EEEEE';
        break;
      default:
        format = 'EEE';
        break;
    }
    return range(7, i => this._datePipe.transform(new Date(2017, 0, i + 1), format));
  }

  getYearName(date: Date): string {
    return this._datePipe.transform(date, 'yyyy');
  }

  getFirstDayOfWeek(): number {
    return 1;
  }

  getNumDaysInMonth(date: Date): number {
    const lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }

  clone(date: Date): Date {
    return new Date(date.valueOf());
  }

  createDate(year: number, month: number, date: number): Date {
    // Check for invalid month and date (except upper bound on date which we have to check after
    // creating the Date).
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const result = this._createDateWithOverflow(year, month, date);
    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    if (result.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  parse(value: any): Date | null {
    if (typeof value === 'number') {
      return new Date(value);
    } else if (typeof value === 'string') {
      return this._parseStringDate(value);
    }
    return null;
  }

  format(date: Date, displayFormat: any): string {
    if (!this.isValid(date)) {
      throw Error('NativeDateAdapter: Cannot format invalid date.');
    }

    return this._titleCasePipe.transform(this._datePipe.transform(date, displayFormat));
  }

  addCalendarYears(date: Date, years: number): Date {
    return this.addCalendarMonths(date, years * 12);
  }

  addCalendarMonths(date: Date, months: number): Date {
    const targetMonth = date.getMonth() + months;
    const dateWithCorrectMonth = new Date(0);
    dateWithCorrectMonth.setFullYear(date.getFullYear(), targetMonth, 1);
    dateWithCorrectMonth.setHours(0, 0, 0, 0);
    const daysInMonth = this.getNumDaysInMonth(dateWithCorrectMonth);
    const newDate = this.clone(date);
    // Adapt last day of month for shorter months
    newDate.setMonth(targetMonth, Math.min(daysInMonth, date.getDate()));
    return newDate;
  }

  addCalendarDays(date: Date, days: number): Date {
    const newDate = this.clone(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  toIso8601(date: Date): string {
    return this._datePipe.transform(date, 'yyyy-MM-dd');
  }

  /**
   * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
   * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
   * invalid date for all other values.
   */
  deserialize(value: any): Date | null {
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
      // string is the right format first.
      if (ISO_8601_REGEX.test(value)) {
        const date = new Date(value);
        if (this.isValid(date)) {
          return date;
        }
      }
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return !isNaN(date.valueOf());
  }

  invalid(): Date {
    return new Date(NaN);
  }

  protected _parseStringDate(value: string) {
    const match = /^(\w+,[ ]?)?(\d+)\.(\d+)\.(\d+)$/.exec(value);
    if (!match) {
      return null;
    }

    const date = this._createDateWithOverflow(+match[4], +match[3] - 1, +match[2]);
    return this._normalizeYear(date);
  }

  protected _normalizeYear(date: Date) {
    if (date.getFullYear() < 0 || date.getFullYear() >= 100) {
      return date;
    }

    const yearOffset = date.getFullYear() <= this._yearPivot ? 2000 : 1900;
    return new Date(date.getFullYear() + yearOffset, date.getMonth(), date.getDate());
  }

  /** Creates a date but allows the month and date to overflow. */
  private _createDateWithOverflow(year: number, month: number, date: number) {
    const result = new Date(year, month, date);

    // We need to correct for the fact that JS native Date treats years in range [0, 99] as
    // abbreviations for 19xx.
    if (year >= 0 && year < 100) {
      result.setFullYear(this.getYear(result) - 1900);
    }
    return result;
  }
}
