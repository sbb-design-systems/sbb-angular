import { CdkStepLabel } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
  selector: '[sbbStepLabel]',
  standalone: true,
})
export class SbbStepLabel extends CdkStepLabel {}
