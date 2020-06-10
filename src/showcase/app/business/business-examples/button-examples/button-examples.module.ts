import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { IconPenModule } from '@sbb-esta/angular-icons/basic';

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
    ButtonModule,
    CheckboxModule,
    FieldModule,
    IconPenModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'button', EXAMPLE_INDEX)],
})
export class ButtonExamplesModule {}
