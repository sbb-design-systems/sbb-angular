import { InjectionToken } from '@angular/core';

export const RECAPTCHA_SETTINGS = new InjectionToken<RecaptchaSettings>('recaptcha-settings');

export interface RecaptchaSettings {
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

export const RECAPTCHA_DEFAULT_BASE_URL = 'https://www.google.com/recaptcha/api.js';

export const RECAPTCHA_CALLBACK_NAME = 'ng2recaptchaloaded';
