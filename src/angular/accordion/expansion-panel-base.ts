import { CdkAccordionItem } from '@angular/cdk/accordion';
import { InjectionToken } from '@angular/core';

/**
 * Base interface for a `MatExpansionPanel`.
 * @docs-private
 */
export interface SBBExpansionPanelBase extends CdkAccordionItem {
  /** Whether the toggle indicator should be hidden. */
  hideToggle: boolean;
}

/**
 * Token used to provide a `SbbExpansionPanel` to `SbbExpansionPanelContent`.
 * Used to avoid circular imports between `SbbExpansionPanel` and `SbbExpansionPanelContent`.
 */
export const SBB_EXPANSION_PANEL = new InjectionToken<SBBExpansionPanelBase>('SBB_EXPANSION_PANEL');
