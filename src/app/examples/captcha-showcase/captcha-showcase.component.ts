import { Component, OnInit } from '@angular/core';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'sbb-captcha-showcase',
  templateUrl: './captcha-showcase.component.html',
  styleUrls: ['./captcha-showcase.component.scss']
})
export class CaptchaShowcaseComponent {

  basicCaptchaResponse: string;

  formModel: FormModel = {};

  resolved(captchaResponse: string) {
    this.basicCaptchaResponse = captchaResponse;
  }

}
