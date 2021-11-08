import { Component } from '@angular/core';

/**
 * @title Captcha Simple
 * @order 10
 */
@Component({
  selector: 'sbb-captcha-simple-example',
  templateUrl: 'captcha-simple-example.html',
  styleUrls: ['captcha-simple-example.css'],
})
export class CaptchaSimpleExample {
  basicCaptchaResponse: string;

  testSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  resolved(captchaResponse: string) {
    this.basicCaptchaResponse = captchaResponse;
  }
}
