import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { RECAPTCHA_CALLBACK_NAME, RECAPTCHA_DEFAULT_BASE_URL } from './captcha-settings';
import { WindowRef } from './windowref.service';

export const RECAPTCHA_LANGUAGE = new InjectionToken<string>('recaptcha-language');
export const RECAPTCHA_BASE_URL = new InjectionToken<string>('recaptcha-base-url');
export const RECAPTCHA_NONCE = new InjectionToken<string>('recaptcha-nonce-tag');

@Injectable()
export class CaptchaLoaderService {
  /**
   * @internal
   * @nocollapse
   */
  private static _ready: BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | null = null;

  ready: Observable<ReCaptchaV2.ReCaptcha>;

  /** @internal */
  private _language: string | null;
  /** @internal */
  private _baseUrl: string | null;
  /** @internal */
  private _nonce: string | null;

  private _document: Document;

  constructor(
    private _windowRef: WindowRef,
    @Inject(DOCUMENT) document: any,
    @Optional() @Inject(RECAPTCHA_LANGUAGE) language?: string,
    @Optional() @Inject(RECAPTCHA_BASE_URL) baseUrl?: string,
    @Optional() @Inject(RECAPTCHA_NONCE) nonce?: string
  ) {
    this._language = language || null;
    this._baseUrl = baseUrl || null;
    this._nonce = nonce || null;
    this._document = document;
    this._init();
    this.ready = CaptchaLoaderService._ready!.pipe(filter((e): e is ReCaptchaV2.ReCaptcha => !!e));
  }

  /** @internal */
  private _init() {
    if (CaptchaLoaderService._ready) {
      return;
    }
    this._windowRef.nativeWindow.ng2recaptchaloaded = () => {
      CaptchaLoaderService._ready!.next(grecaptcha);
    };
    CaptchaLoaderService._ready = new BehaviorSubject<ReCaptchaV2.ReCaptcha | null>(null);
    const script = this._document.createElement('script') as HTMLScriptElement;
    script.innerHTML = '';
    const langParam = this._language ? '&hl=' + this._language : '';
    const baseUrl = this._baseUrl || RECAPTCHA_DEFAULT_BASE_URL;
    script.src = `${baseUrl}?render=explicit&onload=${RECAPTCHA_CALLBACK_NAME}${langParam}`;
    if (this._nonce) {
      script.nonce = this._nonce;
    }
    script.async = true;
    script.defer = true;
    this._document.head.appendChild(script);
  }
}
