import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptchaComponent } from './captcha/captcha.component';
import { CaptchaLoaderService } from './captcha/captcha-loader.service';
import { CaptchaValueAccessorDirective } from './captcha/captcha-value-accessor.directive';
import { WindowRef } from './captcha/windowref.service';

@NgModule({
  declarations: [
    CaptchaComponent,
    CaptchaValueAccessorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CaptchaComponent,
    CaptchaValueAccessorDirective
  ],
  providers: [
    CaptchaLoaderService,
    WindowRef
  ]
})
export class CaptchaModule { }
