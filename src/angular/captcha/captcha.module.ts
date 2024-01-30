import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbCaptcha } from './captcha/captcha';
import { SbbCaptchaLoaderService } from './captcha/captcha-loader.service';
import { SbbWindowRef } from './captcha/windowref.service';

@NgModule({
  imports: [SbbCommonModule, SbbCaptcha],
  exports: [SbbCaptcha],
  providers: [SbbCaptchaLoaderService, SbbWindowRef],
})
export class SbbCaptchaModule {}
