import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from './captcha/captcha.component';
import { CaptchaLoaderService } from './captcha/captcha-loader.service';
import { WindowRef } from './captcha/windowref.service';

@NgModule({
  declarations: [
    CaptchaComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CaptchaComponent
  ],
  providers: [
    CaptchaLoaderService,
    WindowRef
  ]
})
export class CaptchaModule { }
