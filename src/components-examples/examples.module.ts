import { NgModule } from '@angular/core';
import { LoadingExamplesModule } from '@sbb-esta/components-examples/angular/loading';

const EXAMPLES = [LoadingExamplesModule];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES,
})
export class ExamplesModule {}
