import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbLightboxModule } from '@sbb-esta/angular/lightbox';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

import {
  LightboxComponentExample,
  LightboxComponentExampleContent,
} from './lightbox-component/lightbox-component-example';
import {
  LightboxConfirmationExample,
  LightboxWithConfirmationOnClose,
} from './lightbox-confirmation/lightbox-confirmation-example';
import { LightboxTemplateExample } from './lightbox-template/lightbox-template-example';
import { LightboxExample, LightboxExampleContent } from './lightbox/lightbox-example';

export {
  LightboxExample,
  LightboxExampleContent,
  LightboxComponentExample,
  LightboxComponentExampleContent,
  LightboxConfirmationExample,
  LightboxWithConfirmationOnClose as LightboxContent4Example,
  LightboxTemplateExample,
};

const EXAMPLES = [
  LightboxExample,
  LightboxExampleContent,
  LightboxComponentExample,
  LightboxComponentExampleContent,
  LightboxConfirmationExample,
  LightboxWithConfirmationOnClose,
  LightboxTemplateExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbButtonModule,
    SbbFormFieldModule,
    SbbLightboxModule,
    SbbRadioButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LightboxExamplesModule {}
