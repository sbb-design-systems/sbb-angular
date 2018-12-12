import { DateAdapter } from './date-adapter';
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

  private datePipe: DatePipe;

  constructor(@Inject(LOCALE_ID) protected locale: string) {
    super();
    this.datePipe = new DatePipe(locale);
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
    const lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }

  clone(date: Date): Date {
    return new Date(date.valueOf());
  }

  createDate(year: number, month: number, date: number): Date {
    return new Date(year, month, date);
  }

  today(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
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
        return new Date(toInteger(dateParts[2]), toInteger(dateParts[1]) - 1, toInteger(dateParts[0]));
      }
    }
    return null;
  }

  format(date: Date, displayFormat: any): string {
    return this.datePipe.transform(date, displayFormat);
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
    return this.datePipe.transform(date, 'yyyy-MM-dd');
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

}

