import { InjectionToken } from '@angular/core';

export const RECAPTCHA_SETTINGS = new InjectionToken<RecaptchaSettings>('recaptcha-settings');

export interface RecaptchaSettings {
  siteKey?: string;
  theme?: ReCaptchaV2.Theme;
  type?: ReCaptchaV2.Type;
  size?: ReCaptchaV2.Size;
  badge?: ReCaptchaV2.Badge;
}

export const RECAPTCHA_DEFAULT_BASE_URL = 'https://www.google.com/recaptcha/api.js';

export const RECAPTCHA_CALLBACK_NAME = 'ng2recaptchaloaded';
