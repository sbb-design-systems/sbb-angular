import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessflowComponent } from './processflow/processflow.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProcessflowComponent],
  exports: [ProcessflowComponent]
})
export class ProcessflowModule { }
