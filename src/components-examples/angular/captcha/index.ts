import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbCaptchaModule } from '@sbb-esta/angular/captcha';

import { CaptchaReactiveFormsExample } from './captcha-reactive-forms/captcha-reactive-forms-example';
import { CaptchaSimpleExample } from './captcha-simple/captcha-simple-example';
import { CaptchaTemplateDrivenFormsExample } from './captcha-template-driven-forms/captcha-template-driven-forms-example';

export { CaptchaSimpleExample, CaptchaReactiveFormsExample, CaptchaTemplateDrivenFormsExample };

const EXAMPLES = [
  CaptchaSimpleExample,
  CaptchaReactiveFormsExample,
  CaptchaTemplateDrivenFormsExample,
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbButtonModule, SbbCaptchaModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CaptchaExamplesModule {}
