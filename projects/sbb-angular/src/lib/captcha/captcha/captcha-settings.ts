import { InjectionToken } from '@angular/core';

export const RECAPTCHA_SETTINGS = new InjectionToken<RecaptchaSettings>('recaptcha-settings');

export interface RecaptchaSettings {

  /**
   * SiteKey of the user.
   */
  siteKey?: string;
  /**
   * The color theme of the widget.
   */
  theme?: ReCaptchaV2.Theme;
  /**
   * Type of the widget.
   */
  type?: ReCaptchaV2.Type;
  /**
   * The size of the widget.
   */
  size?: ReCaptchaV2.Size;
  /**
   * Badge of the widget.
   */
  badge?: ReCaptchaV2.Badge;
}

export const RECAPTCHA_DEFAULT_BASE_URL = 'https://www.google.com/recaptcha/api.js';

export const RECAPTCHA_CALLBACK_NAME = 'ng2recaptchaloaded';
