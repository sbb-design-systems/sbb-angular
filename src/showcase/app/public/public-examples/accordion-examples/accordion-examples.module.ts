import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { AccordionModule } from '@sbb-esta/angular-public/accordion';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

import { provideExamples } from '../../../shared/example-provider';

import { BasicAccordionExampleComponent } from './basic-accordion-example/basic-accordion-example.component';
import { SimplePanelExampleComponent } from './simple-panel-example/simple-panel-example.component';
import { WizardAccordionExampleComponent } from './wizard-accordion-example/wizard-accordion-example.component';

const EXAMPLES = [
  BasicAccordionExampleComponent,
  SimplePanelExampleComponent,
  WizardAccordionExampleComponent,
];

const EXAMPLE_INDEX = {
  'basic-accordion-example': BasicAccordionExampleComponent,
  'simple-panel-example': SimplePanelExampleComponent,
  'wizard-accordion-example': WizardAccordionExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconArrowRightModule,
    AccordionModule,
    ButtonModule,
    CheckboxModule,
    FieldModule,
    RadioButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'accordion', EXAMPLE_INDEX)],
})
export class AccordionExamplesModule {}
