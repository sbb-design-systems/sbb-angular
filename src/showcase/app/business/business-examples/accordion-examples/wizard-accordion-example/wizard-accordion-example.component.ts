import { Component } from '@angular/core';

@Component({
  selector: 'sbb-wizard-accordion-example',
  templateUrl: './wizard-accordion-example.component.html',
  styles: [
    `
      .panel-text {
        margin: 0 1em;
      }
    `,
  ],
})
export class WizardAccordionExampleComponent {
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
