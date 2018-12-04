/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { InjectionToken } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';

/** MatAccordion's display modes. */
export type SbbAccordionDisplayMode = 'default' | 'flat';

/**
 * Base interface for a `MatAccordion`.
 * @docs-private
 */
export interface SbbAccordionBase extends CdkAccordion {
  /** Whether the expansion indicator should be hidden. */
  hideToggle: boolean;

  /** Display mode used for all expansion panels in the accordion. */
  displayMode: SbbAccordionDisplayMode;

  /** Handles keyboard events coming in from the panel headers. */
  _handleHeaderKeydown: (event: KeyboardEvent) => void;

  /** Handles focus events on the panel headers. */
  _handleHeaderFocus: (header: any) => void;
}


/**
 * Token used to provide a `MatAccordion` to `MatExpansionPanel`.
 * Used primarily to avoid circular imports between `MatAccordion` and `MatExpansionPanel`.
 */
export const SBB_ACCORDION = new InjectionToken<SbbAccordionBase>('SBB_ACCORDION');

