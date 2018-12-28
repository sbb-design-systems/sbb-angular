import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessflowComponent } from './processflow/processflow.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
  ],
  declarations: [ProcessflowComponent],
  exports: [ProcessflowComponent]
})
export class ProcessflowModule { }
