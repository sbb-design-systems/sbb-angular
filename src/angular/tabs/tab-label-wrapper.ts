import { booleanAttribute, Directive, ElementRef, Input } from '@angular/core';

/**
 * Used in the `sbb-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive({
  selector: '[sbbTabLabelWrapper]',
  host: {
    '[class.sbb-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled',
  },
  standalone: true,
})
export class SbbTabLabelWrapper {
  /** Whether the tab is disabled. */
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  constructor(public elementRef: ElementRef) {}

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
