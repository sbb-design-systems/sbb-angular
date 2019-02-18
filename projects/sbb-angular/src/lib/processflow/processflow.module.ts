import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessflowComponent } from './processflow/processflow.component';
import { ProcessflowStepComponent } from './processflow-step/processflow-step.component';
import { IconArrowLeftModule } from '../svg-icons/svg-icons';

@NgModule({
  imports: [
    CommonModule,
    IconArrowLeftModule,
  ],
  declarations: [ProcessflowComponent, ProcessflowStepComponent],
  exports: [ProcessflowComponent, ProcessflowStepComponent]
})
export class ProcessflowModule { }
