import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from '@sbb-esta/angular-business/accordion';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { RadioButtonModule } from '@sbb-esta/angular-business/radio-button';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

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
  'wizard-accordion-example': WizardAccordionExampleComponent,
  'simple-panel-example': SimplePanelExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    ButtonModule,
    CheckboxModule,
    FieldModule,
    RadioButtonModule,
    SbbIconModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'accordion', EXAMPLE_INDEX)],
})
export class AccordionExamplesModule {}
