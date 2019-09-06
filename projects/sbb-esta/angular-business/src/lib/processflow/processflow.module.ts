import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconChevronRightModule } from '@sbb-esta/angular-icons';

import { ProcessflowStepComponent } from './processflow-step/processflow-step.component';
import { ProcessflowComponent } from './processflow/processflow.component';

@NgModule({
  imports: [CommonModule, IconChevronRightModule],
  declarations: [ProcessflowComponent, ProcessflowStepComponent],
  exports: [ProcessflowStepComponent, ProcessflowComponent, IconChevronRightModule]
})
export class ProcessflowModule {}
