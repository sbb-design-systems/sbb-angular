import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbProcessflowStep } from './processflow-step/processflow-step.component';
import { SbbProcessflow } from './processflow/processflow.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbProcessflow, SbbProcessflowStep],
  exports: [SbbProcessflowStep, SbbProcessflow, SbbIconModule],
})
export class SbbProcessflowModule {}
