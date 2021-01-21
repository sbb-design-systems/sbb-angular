import { Component } from '@angular/core';

/**
 * @title Captcha Template Driven Forms
 * @order 30
 */
@Component({
  selector: 'sbb-captcha-template-driven-forms-example',
  templateUrl: './captcha-template-driven-forms-example.html',
  styleUrls: ['./captcha-template-driven-forms-example.css'],
})
export class CaptchaTemplateDrivenFormsExample {
  testSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  captcha: string;
}
