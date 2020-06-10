import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { IconDownloadModule } from '@sbb-esta/angular-icons/basic';
import { IconPlusModule } from '@sbb-esta/angular-icons/navigation';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';

import { provideExamples } from '../../../shared/example-provider';

import { ButtonExampleComponent } from './button-example/button-example.component';

const EXAMPLES = [ButtonExampleComponent];

const EXAMPLE_INDEX = {
  'button-example': ButtonExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconArrowRightModule,
    IconDownloadModule,
    IconPlusModule,
    ButtonModule,
    CheckboxModule,
    FieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'button', EXAMPLE_INDEX)],
})
export class ButtonExamplesModule {}
