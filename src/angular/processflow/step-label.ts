import { CdkStepLabel } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
  selector: '[sbbStepLabel]',
})
export class SbbStepLabel extends CdkStepLabel {}
