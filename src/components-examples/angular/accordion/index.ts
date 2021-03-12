import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

import { BasicAccordionExample } from './basic-accordion/basic-accordion-example';
import { SimplePanelExample } from './simple-panel/simple-panel-example';
import { WizardAccordionExample } from './wizard-accordion/wizard-accordion-example';

export { BasicAccordionExample, SimplePanelExample, WizardAccordionExample };

const EXAMPLES = [BasicAccordionExample, SimplePanelExample, WizardAccordionExample];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbAccordionModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbFormFieldModule,
    SbbRadioButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class AccordionExamplesModule {}
