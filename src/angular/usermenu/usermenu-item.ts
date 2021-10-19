import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'a[sbb-usermenu-item], button[sbb-usermenu-item]',
  host: {
    role: 'menuitem',
    class: 'sbb-usermenu-item',
  },
})
export class SbbUsermenuItem implements FocusableOption {
  constructor(private _focusMonitor: FocusMonitor, private _elementRef: ElementRef<HTMLElement>) {}

  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  /** Gets the label to be used when determining whether the usermenu item should be focused. */
  getLabel(): string {
    const clone = this._elementRef.nativeElement.cloneNode(true) as HTMLElement;
    const icons = clone.querySelectorAll('.sbb-icon');

    // Strip away icons so they don't show up in the text.
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      icon.parentNode?.removeChild(icon);
    }

    return clone.textContent?.trim() || '';
  }
}
