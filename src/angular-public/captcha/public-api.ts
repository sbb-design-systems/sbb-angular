export * from './captcha.module';
export * from './captcha/captcha-settings';
export * from './captcha/windowref.service';
export * from './captcha/captcha-loader.service';
export * from './captcha/captcha.component';
/** @deprecated Remove with v12 */
export { SbbCaptchaModule as CaptchaModule } from './captcha.module';
/** @deprecated Remove with v12 */
export {
  SBB_RECAPTCHA_LANGUAGE as RECAPTCHA_LANGUAGE,
  SBB_RECAPTCHA_BASE_URL as RECAPTCHA_BASE_URL,
  SBB_RECAPTCHA_NONCE as RECAPTCHA_NONCE,
  SbbCaptchaLoaderService as CaptchaLoaderService,
} from './captcha/captcha-loader.service';
/** @deprecated Remove with v12 */
export {
  SBB_RECAPTCHA_SETTINGS as RECAPTCHA_SETTINGS,
  SbbRecaptchaSettings as RecaptchaSettings,
  SBB_RECAPTCHA_DEFAULT_BASE_URL as RECAPTCHA_DEFAULT_BASE_URL,
  SBB_RECAPTCHA_CALLBACK_NAME as RECAPTCHA_CALLBACK_NAME,
} from './captcha/captcha-settings';
/** @deprecated Remove with v12 */
export { SbbCaptcha as CaptchaComponent } from './captcha/captcha.component';
/** @deprecated Remove with v12 */
export { SbbWindowRef as WindowRef } from './captcha/windowref.service';
