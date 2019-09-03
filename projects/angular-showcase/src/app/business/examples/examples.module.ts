import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProcessflowShowcaseComponent } from './processflow-showcase/processflow-showcase.component';
import { ProcessflowModule } from '@sbb-esta/angular-business';

const exampleComponents = [ProcessflowShowcaseComponent];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [CommonModule, ProcessflowModule]
})
export class ExamplesModule {}
