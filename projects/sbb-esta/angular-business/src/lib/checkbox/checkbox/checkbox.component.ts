import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseCheckbox } from '../../../../../angular-public/src/lib/checkbox/checkbox/base-checkbox';

@Component({
  selector: 'sbb-checkbox',
  templateUrl: '../../../../../angular-public/src/lib/checkbox/checkbox/checkbox.component.html',
  styleUrls: ['../../../../../angular-public/src/lib/checkbox/checkbox/checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends BaseCheckbox {
  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

  /** @docs-private */
  @HostBinding('class.sbb-checkbox-indeterminate') indeterminateClass = false;

  /**
   * The indeterminate state of the checkbox
   */
  @Input()
  get indeterminate(): any {
    return this._indeterminate;
  }
  set indeterminate(value: any) {
    this._indeterminate = value;
    this.indeterminateClass = this._indeterminate;
    this._changeDetector.markForCheck();
  }
  private _indeterminate = false;

  /** @inheritDoc */
  click() {
    if (this.indeterminate && this.checked) {
      this.indeterminate = false;
      return false; // prevent default
    } else {
      this.indeterminate = false;
      super.click();
    }
  }

  /** @docs-private */
  get ariaChecked(): String {
    return this.checked ? 'true' : this.indeterminate ? 'mixed' : 'false';
  }
}
