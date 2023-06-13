import { Component } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';

/**
 * @title Wizard Accordion
 * @order 30
 */
@Component({
  selector: 'sbb-accordion-wizard-example',
  templateUrl: 'accordion-wizard-example.html',
  styleUrls: ['accordion-wizard-example.css'],
  standalone: true,
  imports: [SbbAccordionModule, SbbButtonModule],
})
export class AccordionWizardExample {
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  log(...args: any[]) {
    console.log(args);
  }
}
