import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { AccordionModule } from '@sbb-esta/angular-public/accordion';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

import { AccordionExampleComponent } from './accordion-example/accordion-example.component';

const EXAMPLES = [AccordionExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconArrowRightModule,
    AccordionModule,
    CheckboxModule,
    FieldModule,
    RadioButtonModule,
    ButtonModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class AccordionExamplesModule {}
