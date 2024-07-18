import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionWizardExample {
  step = signal(0);

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update((i) => i + 1);
  }

  prevStep() {
    this.step.update((i) => i - 1);
  }

  log(...args: any[]) {
    console.log(args);
  }
}
