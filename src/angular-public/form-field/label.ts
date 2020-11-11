import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'sbb-label',
  host: {
    class: 'sbb-label',
  },
})
export class SbbLabel {
  /**
   * Label of a input text
   * @deprecated Handled internally in sbb-field.
   * @breaking-change 12.0.0
   */
  @Input()
  get for(): string | null {
    return this._for;
  }
  set for(value: string | null) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      console.warn(
        'sbb-label[for] is deprecated! This functionality is handled internally in the sbb-field.'
      );
    }
    this._for = value;
  }
  private _for: string | null = null;
}
