import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCaptchaModule } from '@sbb-esta/angular/captcha';

/**
 * @title Captcha Simple
 * @order 10
 */
@Component({
  selector: 'sbb-captcha-simple-example',
  templateUrl: 'captcha-simple-example.html',
  styleUrls: ['captcha-simple-example.css'],
  imports: [SbbCaptchaModule, SbbButtonModule, JsonPipe],
})
export class CaptchaSimpleExample {
  basicCaptchaResponse: string;

  testSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  resolved(captchaResponse: string) {
    this.basicCaptchaResponse = captchaResponse;
  }
}
