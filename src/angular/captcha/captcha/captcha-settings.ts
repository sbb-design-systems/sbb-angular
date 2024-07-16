// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="grecaptcha" preserve="true" />

import { InjectionToken } from '@angular/core';

export const SBB_RECAPTCHA_SETTINGS = new InjectionToken<SbbRecaptchaSettings>(
  'recaptcha-settings',
);

export interface SbbRecaptchaSettings {
  /**
   * SiteKey of the user.
   * It is optional.
   */
  siteKey?: string;
  /**
   * The color theme of the widget.
   * It is optional.
   */
  theme?: ReCaptchaV2.Theme;
  /**
   * Type of the widget.
   * It is optional.
   */
  type?: ReCaptchaV2.Type;
  /**
   * The size of the widget.
   * It is optional.
   */
  size?: ReCaptchaV2.Size;
  /**
   * Badge of the widget.
   * It is optional.
   */
  badge?: ReCaptchaV2.Badge;
}

export const SBB_RECAPTCHA_DEFAULT_BASE_URL = 'https://www.google.com/recaptcha/api.js';

export const SBB_RECAPTCHA_CALLBACK_NAME = 'ng2recaptchaloaded';
