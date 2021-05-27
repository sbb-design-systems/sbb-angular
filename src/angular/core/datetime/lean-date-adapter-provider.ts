import { Provider } from '@angular/core';

import { SbbDateAdapter } from './date-adapter';
import { SbbLeanDateAdapter } from './lean-date-adapter';

export const SBB_LEAN_DATE_ADAPTER: Provider = {
  provide: SbbDateAdapter,
  useClass: SbbLeanDateAdapter,
};
