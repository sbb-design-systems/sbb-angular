import {
  Directive,
  forwardRef,
  HostListener,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { CaptchaComponent } from './captcha.component';


@Directive({
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaValueAccessorDirective),
    },
  ],
  // tslint:disable-next-line:directive-selector
  selector: 'sbb-captcha[formControlName],sbb-captcha[formControl],sbb-captcha[ngModel]',
})
export class CaptchaValueAccessorDirective implements ControlValueAccessor {
  /** @internal */
  private _onChange: (value: string) => void;

  /** @internal */
  private _onTouched: () => void;

  constructor(private _host: CaptchaComponent) { }

  writeValue(value: string): void {
    if (!value) {
      this._host.reset();
    }
  }

  registerOnChange(fn: (value: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }

  @HostListener('resolved', ['$event'])
  onResolve($event: string) {
    if (this._onChange) {
      this._onChange($event);
    }
    if (this._onTouched) {
      this._onTouched();
    }
  }
}
