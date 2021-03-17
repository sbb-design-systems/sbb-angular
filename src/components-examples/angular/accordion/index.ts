import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

import { AccordionBasicExample } from './accordion-basic/accordion-basic-example';
import { AccordionCustomHtmlExample } from './accordion-custom-html/accordion-custom-html-example';
import { AccordionNestedPanelLazyContentExample } from './accordion-nested-panel-lazy-content/accordion-nested-panel-lazy-content-example';
import { AccordionSimplePanelExample } from './accordion-simple-panel/accordion-simple-panel-example';
import { AccordionWizardExample } from './accordion-wizard/accordion-wizard-example';

export {
  AccordionBasicExample,
  AccordionCustomHtmlExample,
  AccordionNestedPanelLazyContentExample,
  AccordionSimplePanelExample,
  AccordionWizardExample,
};

const EXAMPLES = [
  AccordionBasicExample,
  AccordionCustomHtmlExample,
  AccordionNestedPanelLazyContentExample,
  AccordionSimplePanelExample,
  AccordionWizardExample,
];

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
