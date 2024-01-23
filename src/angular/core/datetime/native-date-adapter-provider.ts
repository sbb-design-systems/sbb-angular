import { Provider } from '@angular/core';

import { SbbDateAdapter } from './date-adapter';
import { SBB_DATE_FORMATS } from './date-formats';
import { SBB_DATE_PIPE_DATE_FORMATS } from './date-pipe-date-formats';
import { SbbNativeDateAdapter } from './native-date-adapter';
export function provideNativeDateAdapter(): Provider[] {
  return [
    { provide: SbbDateAdapter, useClass: SbbNativeDateAdapter },
    { provide: SBB_DATE_FORMATS, useValue: SBB_DATE_PIPE_DATE_FORMATS },
  ];
}
