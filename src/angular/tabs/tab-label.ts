import { CdkPortal } from '@angular/cdk/portal';
import { Directive, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `SbbTabLabel`. It serves as
 * alternative token to the actual `SbbTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_TAB_LABEL = new InjectionToken<SbbTabLabel>('SbbTabLabel');

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: '[sbb-tab-label], [sbbTabLabel]',
  providers: [{ provide: SBB_TAB_LABEL, useExisting: SbbTabLabel }],
})
export class SbbTabLabel extends CdkPortal {}
