import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessflowComponent } from './processflow/processflow.component';
import { ProcessflowStepComponent } from './processflow-step/processflow-step.component';
import { IconChevronRightModule } from 'sbb-angular-icons';

@NgModule({
  imports: [
    CommonModule,
    IconChevronRightModule,
  ],
  declarations: [ProcessflowComponent, ProcessflowStepComponent],
  exports: [ProcessflowComponent, ProcessflowStepComponent]
})
export class ProcessflowModule { }
