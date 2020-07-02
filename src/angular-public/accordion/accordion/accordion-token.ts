import { InjectionToken } from '@angular/core';

import type { AccordionDirective } from './accordion.directive';

/**
 * Token used to provide a `SbbAccordion` to `SbbExpansionPanel`.
 * Used primarily to avoid circular imports between `SbbAccordion` and `SbbExpansionPanel`.
 */
export const SBB_ACCORDION = new InjectionToken<AccordionDirective>('SBB_ACCORDION');
