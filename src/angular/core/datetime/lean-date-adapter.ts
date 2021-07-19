import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';

import { SBB_DATEPICKER_2DIGIT_YEAR_PIVOT } from './datepicker-token';
import { SbbNativeDateAdapter } from './native-date-adapter';

@Injectable()
export class SbbLeanDateAdapter extends SbbNativeDateAdapter {
  constructor(
    @Inject(LOCALE_ID) protected override _locale: string,
    @Optional() @Inject(SBB_DATEPICKER_2DIGIT_YEAR_PIVOT) yearPivot: number
  ) {
    super(_locale, yearPivot);
  }

  protected override _parseStringDate(value: string): null | Date {
    return super._parseStringDate(value) || this._parseStringDateLean(value);
  }

  private _parseStringDateLean(value: string): null | Date {
    const match = /^(\w+,[ ]?)?(\d{2})(\d{2})(\d{2}|\d{4})$/.exec(value);
    if (!match) {
      return null;
    }
    return this._normalizeYear(this._createDateWithOverflow(+match[4], +match[3] - 1, +match[2]));
  }
}
