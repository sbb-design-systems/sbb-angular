import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbCaptchaLoaderService } from './captcha/captcha-loader.service';
import { SbbCaptcha } from './captcha/captcha.component';
import { SbbWindowRef } from './captcha/windowref.service';

@NgModule({
  declarations: [SbbCaptcha],
  imports: [CommonModule],
  exports: [SbbCaptcha],
  providers: [SbbCaptchaLoaderService, SbbWindowRef],
})
export class SbbCaptchaModule {}
