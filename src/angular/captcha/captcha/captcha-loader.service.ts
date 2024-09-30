// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="grecaptcha" preserve="true" />

import { DOCUMENT } from '@angular/common';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SBB_RECAPTCHA_CALLBACK_NAME, SBB_RECAPTCHA_DEFAULT_BASE_URL } from './captcha-settings';
import { SbbWindowRef } from './windowref.service';

export const SBB_RECAPTCHA_LANGUAGE = new InjectionToken<string>('recaptcha-language');
export const SBB_RECAPTCHA_BASE_URL = new InjectionToken<string>('recaptcha-base-url');
export const SBB_RECAPTCHA_NONCE = new InjectionToken<string>('recaptcha-nonce-tag');

@Injectable()
export class SbbCaptchaLoaderService {
  private _windowRef = inject(SbbWindowRef);

  /** @nocollapse */
  private static _ready: BehaviorSubject<ReCaptchaV2.ReCaptcha | null> | null = null;

  ready: Observable<ReCaptchaV2.ReCaptcha>;

  private _language: string | null;
  private _baseUrl: string | null;
  private _nonce: string | null;

  private _document: Document;

  constructor(...args: unknown[]);
  constructor() {
    const document = inject(DOCUMENT);
    const language = inject(SBB_RECAPTCHA_LANGUAGE, { optional: true });
    const baseUrl = inject(SBB_RECAPTCHA_BASE_URL, { optional: true });
    const nonce = inject(SBB_RECAPTCHA_NONCE, { optional: true });

    this._language = language || null;
    this._baseUrl = baseUrl || null;
    this._nonce = nonce || null;
    this._document = document;
    this._init();
    this.ready = SbbCaptchaLoaderService._ready!.pipe(
      filter((e): e is ReCaptchaV2.ReCaptcha => !!e),
    );
  }

  private _init() {
    if (SbbCaptchaLoaderService._ready) {
      return;
    }
    this._windowRef.nativeWindow.ng2recaptchaloaded = () => {
      SbbCaptchaLoaderService._ready!.next(grecaptcha);
    };
    SbbCaptchaLoaderService._ready = new BehaviorSubject<ReCaptchaV2.ReCaptcha | null>(null);
    const script = this._document.createElement('script') as HTMLScriptElement;
    script.innerHTML = '';
    const langParam = this._language ? '&hl=' + this._language : '';
    const baseUrl = this._baseUrl || SBB_RECAPTCHA_DEFAULT_BASE_URL;
    script.src = `${baseUrl}?render=explicit&onload=${SBB_RECAPTCHA_CALLBACK_NAME}${langParam}`;
    if (this._nonce) {
      script.nonce = this._nonce;
    }
    script.async = true;
    script.defer = true;
    this._document.head.appendChild(script);
  }
}
