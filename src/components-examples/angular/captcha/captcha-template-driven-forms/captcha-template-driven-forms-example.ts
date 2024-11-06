import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCaptchaModule } from '@sbb-esta/angular/captcha';

/**
 * @title Captcha Template Driven Forms
 * @order 30
 */
@Component({
  selector: 'sbb-captcha-template-driven-forms-example',
  templateUrl: 'captcha-template-driven-forms-example.html',
  styleUrls: ['captcha-template-driven-forms-example.css'],
  imports: [SbbCaptchaModule, FormsModule, JsonPipe],
})
export class CaptchaTemplateDrivenFormsExample {
  testSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  captcha: string;
}
