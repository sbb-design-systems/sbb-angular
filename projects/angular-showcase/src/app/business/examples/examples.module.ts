import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProcessflowModule } from '@sbb-esta/angular-business';

import { ProcessflowShowcaseComponent } from './processflow-showcase/processflow-showcase.component';

const exampleComponents = [ProcessflowShowcaseComponent];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [CommonModule, ProcessflowModule]
})
export class ExamplesModule {}
