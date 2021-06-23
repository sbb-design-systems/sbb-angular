import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
  selector: 'button[sbbProcessflowNext]',
  host: {
    class: 'sbb-processflow-next',
    '[type]': 'type',
  },
  inputs: ['type'],
})
export class SbbProcessflowNext extends CdkStepperNext {}

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
  selector: 'button[sbbProcessflowPrevious]',
  host: {
    class: 'sbb-processflow-previous',
    '[type]': 'type',
  },
  inputs: ['type'],
})
export class SbbProcessflowPrevious extends CdkStepperPrevious {}
