import { CdkPortal } from '@angular/cdk/portal';
import {
  Directive,
  Inject,
  InjectionToken,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Injection token that can be used to reference instances of `SbbTabLabel`. It serves as
 * alternative token to the actual `SbbTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_TAB_LABEL = new InjectionToken<SbbTabLabel>('SbbTabLabel');

/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export const SBB_TAB = new InjectionToken<any>('SBB_TAB');

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: '[sbb-tab-label], [sbbTabLabel]',
  providers: [{ provide: SBB_TAB_LABEL, useExisting: SbbTabLabel }],
  standalone: true,
})
export class SbbTabLabel extends CdkPortal {
  constructor(
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    @Inject(SBB_TAB) @Optional() public _closestTab: any,
  ) {
    super(templateRef, viewContainerRef);
  }
}
