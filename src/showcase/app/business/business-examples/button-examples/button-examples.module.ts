import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { IconPenModule } from '@sbb-esta/angular-icons/basic';

import { ButtonExampleComponent } from './button-example/button-example.component';

const EXAMPLES = [ButtonExampleComponent];

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
})
export class ButtonExamplesModule {}
