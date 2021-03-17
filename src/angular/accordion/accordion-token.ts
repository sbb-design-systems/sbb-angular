import { InjectionToken } from '@angular/core';

import type { SbbAccordion } from './accordion';

/**
 * Token used to provide a `SbbAccordion` to `SbbExpansionPanel`.
 * Used primarily to avoid circular imports between `SbbAccordion` and `SbbExpansionPanel`.
 */
export const SBB_ACCORDION = new InjectionToken<SbbAccordion>('SBB_ACCORDION');
