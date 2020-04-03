import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';

import { SBB_DATEPICKER_2DIGIT_YEAR_PIVOT } from './datepicker-token';
import { NativeDateAdapter } from './native-date-adapter';

@Injectable()
export class BusinessDateAdapter extends NativeDateAdapter {
  constructor(
    @Inject(LOCALE_ID) protected _locale: string,
    @Optional() @Inject(SBB_DATEPICKER_2DIGIT_YEAR_PIVOT) yearPivot: number
  ) {
    super(_locale, yearPivot);
  }

  protected _parseStringDate(value: string): null | Date {
    const superDate = super._parseStringDate(value);
    if (superDate) {
      return superDate;
    }

    const dateWithFullYear = this._parseStringDateBusiness(value, 4);
    if (dateWithFullYear) {
      return dateWithFullYear;
    }

    return this._parseStringDateBusiness(value, 2);
  }

  private _parseStringDateBusiness(value: string, yearLength: 2 | 4): null | Date {
    const totalLength = 4 + yearLength;
    const match = new RegExp(`^(\\w+,[ ]?)?(\\d{${totalLength}})$`).exec(value);
    if (!match) {
      return null;
    }
    return this._normalizeYear(
      this._createDateWithOverflow(
        +match[2].substr(4, yearLength),
        +match[2].substr(2, 2) - 1,
        +match[2].substr(0, 2)
      )
    );
  }
}
