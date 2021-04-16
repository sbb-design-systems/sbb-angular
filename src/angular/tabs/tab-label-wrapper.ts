import { BooleanInput } from '@angular/cdk/coercion';
import { Directive, ElementRef } from '@angular/core';
import { CanDisable, CanDisableCtor, mixinDisabled } from '@sbb-esta/angular/core';

// Boilerplate for applying mixins to SbbTabLabelWrapper.
/** @docs-private */
class SbbTabLabelWrapperBase {}
// tslint:disable-next-line:naming-convention
const _SbbTabLabelWrapperMixinBase: CanDisableCtor & typeof SbbTabLabelWrapperBase =
  mixinDisabled(SbbTabLabelWrapperBase);

/**
 * Used in the `sbb-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive({
  selector: '[sbbTabLabelWrapper]',
  inputs: ['disabled'],
  host: {
    '[class.sbb-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled',
  },
})
export class SbbTabLabelWrapper extends _SbbTabLabelWrapperMixinBase implements CanDisable {
  constructor(public elementRef: ElementRef) {
    super();
  }

  /** Sets focus on the wrapper element */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
