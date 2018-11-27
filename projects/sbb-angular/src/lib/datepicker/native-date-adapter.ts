import { DateAdapter } from './date-adapter';
import {
  getDate,
  getMonth,
  getYear,
  getDay,
  getDaysInMonth,
  parse,
  startOfToday,
  isValid,
  isDate,
  addDays,
  addMonths,
  addYears
} from 'date-fns';
import { DatePipe } from '@angular/common';
import { LOCALE_ID, Inject, Injectable } from '@angular/core';

const dateRegex = new RegExp('^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)[0-9]{2}|[0-9]{2})\s*$', 'g');


/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

export function toInteger(value: any): number {
  return Number(value);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

@Injectable()
export class NativeDateAdapter extends DateAdapter<Date> {
  localeChanges;
  protected _localeChanges;
  private datePipe: DatePipe;

  constructor(@Inject(LOCALE_ID) protected locale: string) {
    super();
    this.datePipe = new DatePipe(locale);
  }

  getYear(date: Date): number {
    return getYear(date);
  }
  getMonth(date: Date): number {
    return getMonth(date);
  }
  getDate(date: Date): number {
    return getDate(date);
  }
  getDayOfWeek(date: Date): number {
    return getDay(date);
  }

  getMonthName(date: Date) {
    return this.datePipe.transform(date, 'LLLL');
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
    return range(12, i =>
      this.datePipe.transform(new Date(2017, i, 1), format));
  }

  getDateNames(): string[] {
    return range(31, i =>
      this.datePipe.transform(new Date(2017, 0, i + 1), 'd'));
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
    return range(7, i =>
      this.datePipe.transform(new Date(2017, 0, i + 1), format));
  }

  getYearName(date: Date): string {
    return this.datePipe.transform(date, 'yyyy');
  }

  getFirstDayOfWeek(): number {
    return 1;
  }

  getNumDaysInMonth(date: Date): number {
    return getDaysInMonth(date);
  }

  clone(date: Date): Date {
    return parse(date);
  }

  createDate(year: number, month: number, date: number): Date {
    return new Date(year, month, date);
  }

  today(): Date {
    return startOfToday();
  }

  parse(value: any): Date {

    if (value) {
      const splittedDate = value.split(',');
      if (splittedDate.length > 1) {
        value = splittedDate[1].trim();
      }
      const matches = (value as string).match(dateRegex);
      if (matches) {
        const dateParts = value.trim().split('.');
        const date = new Date(toInteger(dateParts[2]), toInteger(dateParts[1]) - 1, toInteger(dateParts[0]));
        return parse(date);
      }
    }
    return null;
  }

  format(date: Date, displayFormat: any): string {
    return this.datePipe.transform(date, displayFormat);
  }

  addCalendarYears(date: Date, years: number): Date {
    return addYears(date, years);
  }

  addCalendarMonths(date: Date, months: number): Date {
    return addMonths(date, months);
  }

  addCalendarDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  toIso8601(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  isDateInstance(obj: any): boolean {
    return isDate(obj);
  }

  isValid(date: Date): boolean {
    return isValid(date);
  }

  invalid(): Date {
    return new Date(NaN);
  }

}

