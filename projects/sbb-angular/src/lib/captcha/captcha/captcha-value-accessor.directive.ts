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
  private onChange: (value: string) => void;

  /** @internal */
  private onTouched: () => void;

  constructor(private host: CaptchaComponent) { }

  public writeValue(value: string): void {
    if (!value) {
      this.host.reset();
    }
  }

  public registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  public registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  @HostListener('resolved', ['$event']) public onResolve($event: string) {
    if (this.onChange) {
      this.onChange($event);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }
}
