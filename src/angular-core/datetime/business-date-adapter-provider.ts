import { Provider } from '@angular/core';

import { SbbBusinessDateAdapter } from './business-date-adapter';
import { SbbDateAdapter } from './date-adapter';

export const SBB_BUSINESS_DATE_ADAPTER: Provider = {
  provide: SbbDateAdapter,
  useClass: SbbBusinessDateAdapter,
};
