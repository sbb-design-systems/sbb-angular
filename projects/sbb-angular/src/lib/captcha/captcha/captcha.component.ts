import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ChangeDetectionStrategy,
  HostListener,
  forwardRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { RECAPTCHA_SETTINGS, RecaptchaSettings } from './captcha-settings';
import { CaptchaLoaderService } from './captcha-loader.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  exportAs: 'sbbCaptcha',
  selector: 'sbb-captcha',
  template: ``,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaptchaComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input()
  @HostBinding('attr.id')
  id = `sbbcaptcha-${nextId++}`;

  @Input() siteKey: string;
  @Input() theme: ReCaptchaV2.Theme;
  @Input() type: ReCaptchaV2.Type;
  @Input() size: ReCaptchaV2.Size;
  @Input() tabIndex: number;
  @Input() badge: ReCaptchaV2.Badge;

  @Output() resolved = new EventEmitter<string>();

  /** @internal */
  private _subscription: Subscription;
  /** @internal */
  private _widget: number;
  /** @internal */
  private _grecaptcha: ReCaptchaV2.ReCaptcha;
  /** @internal */
  private _executeRequested: boolean;

  /** @internal */
  private _onChange: (value: string) => void;

  /** @internal */
  private _onTouched: () => void;

  @HostListener('resolved', ['$event'])
  onResolve($event: string) {
    if (this._onChange) {
      this._onChange($event);
    }
    if (this._onTouched) {
      this._onTouched();
    }
  }

  constructor(
    private _elementRef: ElementRef,
    private _loader: CaptchaLoaderService,
    private _zone: NgZone,
    @Optional() @Inject(RECAPTCHA_SETTINGS) settings?: RecaptchaSettings,
  ) {
    if (settings) {
      this.siteKey = settings.siteKey;
      this.theme = settings.theme;
      this.type = settings.type;
      this.size = settings.size;
      this.badge = settings.badge;
    }
  }

  writeValue(value: string): void {
    if (!value) {
      this.reset();
    }
  }

  registerOnChange(fn: (value: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }

  ngAfterViewInit() {
    this._subscription = this._loader.ready.subscribe((grecaptcha: ReCaptchaV2.ReCaptcha) => {
      if (grecaptcha != null && grecaptcha.render instanceof Function) {
        this._grecaptcha = grecaptcha;
        this._renderRecaptcha();
      }
    });
  }

  ngOnDestroy() {
    // reset the captcha to ensure it does not leave anything behind
    // after the component is no longer needed
    this._grecaptchaReset();
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * Executes the invisible recaptcha.
   * Does nothing if component's size is not set to "invisible".
   */
  execute(): void {
    if (this.size !== 'invisible') {
      return;
    }

    if (this._widget != null) {
      this._grecaptcha.execute(this._widget);
    } else {
      // delay execution of recaptcha until it actually renders
      this._executeRequested = true;
    }
  }

  reset() {
    if (this._widget != null) {
      if (this._grecaptcha.getResponse(this._widget)) {
        // Only emit an event in case if something would actually change.
        // That way we do not trigger "touching" of the control if someone does a "reset"
        // on a non-resolved captcha.
        this.resolved.emit(null);
      }

      this._grecaptchaReset();
    }
  }

  /** @internal */
  private _expired() {
    this.resolved.emit(null);
  }

  /** @internal */
  private _captchaResponseCallback(response: string) {
    this.resolved.emit(response);
  }

  /** @internal */
  private _grecaptchaReset() {
    if (this._widget != null) {
      this._zone.runOutsideAngular(() => this._grecaptcha.reset(this._widget));
    }
  }

  /** @internal */
  private _renderRecaptcha() {
    this._widget = this._grecaptcha.render(this._elementRef.nativeElement, {
      badge: this.badge,
      callback: (response: string) => {
        this._zone.run(() => this._captchaResponseCallback(response));
      },
      'expired-callback': () => {
        this._zone.run(() => this._expired());
      },
      sitekey: this.siteKey,
      size: this.size,
      tabindex: this.tabIndex,
      theme: this.theme,
      type: this.type,
    });

    if (this._executeRequested === true) {
      this._executeRequested = false;
      this.execute();
    }
  }
}
