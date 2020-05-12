import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { RadioButtonModule } from '@sbb-esta/angular-business/radio-button';

import { RadioButtonExampleComponent } from './radio-button-example/radio-button-example.component';

const EXAMPLES = [RadioButtonExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, RadioButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class RadioButtonExamplesModule {}
