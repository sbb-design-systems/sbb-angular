import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbFieldModule } from '@sbb-esta/angular-business/field';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

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
    SbbButtonModule,
    SbbCheckboxModule,
    SbbFieldModule,
    SbbIconModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'button', EXAMPLE_INDEX)],
})
export class ButtonExamplesModule {}
