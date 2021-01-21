import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @title Captcha Reactive Forms
 * @order 20
 */
@Component({
  selector: 'sbb-captcha-reactive-forms-example',
  templateUrl: './captcha-reactive-forms-example.html',
  styleUrls: ['./captcha-reactive-forms-example.css'],
})
export class CaptchaReactiveFormsExample {
  testSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  formControl: FormControl = new FormControl('', [Validators.required]);
}
