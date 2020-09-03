import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { ProcessflowStepComponent } from './processflow-step/processflow-step.component';
import { ProcessflowComponent } from './processflow/processflow.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [ProcessflowComponent, ProcessflowStepComponent],
  exports: [ProcessflowComponent, ProcessflowStepComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class ProcessflowModule {}
