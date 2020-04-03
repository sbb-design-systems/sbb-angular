import { BusinessDateAdapter } from './business-date-adapter';
import { DateAdapter } from './date-adapter';

export const SBB_BUSINESS_DATE_ADAPTER = { provide: DateAdapter, useClass: BusinessDateAdapter };
