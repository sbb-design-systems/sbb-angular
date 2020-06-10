import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CaptchaModule } from '@sbb-esta/angular-public/captcha';

import { provideExamples } from '../../../shared/example-provider';

import { CaptchaExampleComponent } from './captcha-example/captcha-example.component';

const EXAMPLES = [CaptchaExampleComponent];

const EXAMPLE_INDEX = {
  'captcha-example': CaptchaExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CaptchaModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'captcha', EXAMPLE_INDEX)],
})
export class CaptchaExamplesModule {}
