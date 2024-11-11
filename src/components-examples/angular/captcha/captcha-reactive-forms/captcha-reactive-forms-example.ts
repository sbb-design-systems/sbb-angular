import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbCaptchaModule } from '@sbb-esta/angular/captcha';

/**
 * @title Captcha Reactive Forms
 * @order 20
 */
@Component({
  selector: 'sbb-captcha-reactive-forms-example',
  templateUrl: 'captcha-reactive-forms-example.html',
  styleUrls: ['captcha-reactive-forms-example.css'],
  imports: [SbbCaptchaModule, FormsModule, ReactiveFormsModule, JsonPipe],
})
export class CaptchaReactiveFormsExample {
  testSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  formControl: FormControl = new FormControl('', [Validators.required]);
}
