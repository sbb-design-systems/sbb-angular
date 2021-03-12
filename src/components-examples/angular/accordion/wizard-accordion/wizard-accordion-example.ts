import { Component } from '@angular/core';

/**
 * @title Wizard Accordion
 * @order 30
 */
@Component({
  selector: 'sbb-wizard-accordion-example',
  templateUrl: './wizard-accordion-example.html',
  styleUrls: ['./wizard-accordion-example.css'],
})
export class WizardAccordionExample {
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
