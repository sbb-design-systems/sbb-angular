import { CdkAccordion } from '@angular/cdk/accordion';
import { InjectionToken } from '@angular/core';

export interface IAccordionBase extends CdkAccordion {
  /** Whether the expansion indicator should be hidden. */
  hideToggle: boolean;

  /** Handles keyboard events coming in from the panel headers. */
  handleHeaderKeydown: (event: KeyboardEvent) => void;

  /** Handles focus events on the panel headers. */
  handleHeaderFocus: (header: any) => void;
}

/**
 * Token used to provide a `SbbAccordion` to `SbbExpansionPanel`.
 * Used primarily to avoid circular imports between `SbbAccordion` and `SbbExpansionPanel`.
 */
export const SBB_ACCORDION = new InjectionToken<IAccordionBase>('SBB_ACCORDION');
