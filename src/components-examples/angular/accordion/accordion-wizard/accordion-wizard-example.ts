import { Component } from '@angular/core';

/**
 * @title Wizard Accordion
 * @order 30
 */
@Component({
  selector: 'sbb-accordion-wizard-example',
  templateUrl: './accordion-wizard-example.html',
  styleUrls: ['./accordion-wizard-example.css'],
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
