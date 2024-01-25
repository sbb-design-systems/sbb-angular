import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbProcessflow, SbbStep } from './processflow';
import { SbbProcessflowNext, SbbProcessflowPrevious } from './processflow-button';
import { SbbStepContent } from './step-content';
import { SbbStepHeader } from './step-header';
import { SbbStepLabel } from './step-label';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    CdkStepperModule,
    SbbCommonModule,
    SbbIconModule,
    SbbStep,
    SbbStepLabel,
    SbbProcessflow,
    SbbProcessflowNext,
    SbbProcessflowPrevious,
    SbbStepHeader,
    SbbStepContent,
  ],
  exports: [
    SbbStep,
    SbbStepLabel,
    SbbProcessflow,
    SbbProcessflowNext,
    SbbProcessflowPrevious,
    SbbStepHeader,
    SbbStepContent,
  ],
})
export class SbbProcessflowModule {}
