import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'sbb-captcha-showcase',
  templateUrl: './captcha-showcase.component.html',
  styleUrls: ['./captcha-showcase.component.scss']
})
export class CaptchaShowcaseComponent implements OnInit, OnDestroy {
  basicCaptchaResponse: string;

  formModel: FormModel = {};
  formModelReactive: FormModel = {};

  formCaptcha: FormGroup;

  captchaSubscription: Subscription;

  testSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  captcha: FormControl = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.formCaptcha = new FormGroup({
      captcha: this.captcha
    });

    this.captchaSubscription = this.formCaptcha.get('captcha').valueChanges.subscribe(value => {
      this.formModelReactive.captcha = value;
    });
  }

  ngOnDestroy() {
    if (this.captchaSubscription) {
      this.captchaSubscription.unsubscribe();
    }
  }

  resolved(captchaResponse: string) {
    this.basicCaptchaResponse = captchaResponse;
  }

  resetForm() {
    this.formCaptcha.reset();
  }
}
