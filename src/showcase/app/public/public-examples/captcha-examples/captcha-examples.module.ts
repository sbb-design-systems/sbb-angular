import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaptchaModule } from '@sbb-esta/angular-public/captcha';

import { CaptchaExampleComponent } from './captcha-example/captcha-example.component';

const EXAMPLES = [CaptchaExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CaptchaModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class CaptchaExamplesModule {}
