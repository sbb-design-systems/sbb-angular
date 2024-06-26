import { Provider } from '@angular/core';

import { SbbDateAdapter } from './date-adapter';
import { SBB_DATE_FORMATS } from './date-formats';
import { SBB_DATE_PIPE_DATE_FORMATS } from './date-pipe-date-formats';
import { SbbLeanDateAdapter } from './lean-date-adapter';

export const SBB_LEAN_DATE_ADAPTER: Provider = {
  provide: SbbDateAdapter,
  useClass: SbbLeanDateAdapter,
};

export function provideLeanDateAdapter(): Provider[] {
  return [
    SBB_LEAN_DATE_ADAPTER,
    { provide: SBB_DATE_FORMATS, useValue: SBB_DATE_PIPE_DATE_FORMATS },
  ];
}
