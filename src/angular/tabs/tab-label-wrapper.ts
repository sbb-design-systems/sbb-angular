import { Directive, ElementRef } from '@angular/core';
import { CanDisable, mixinDisabled } from '@sbb-esta/angular/core';

// Boilerplate for applying mixins to SbbTabLabelWrapper.
// tslint:disable-next-line:naming-convention
const _SbbTabLabelWrapperMixinBase = mixinDisabled(class {});

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
  standalone: true,
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
}
