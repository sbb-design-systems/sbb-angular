import { NgModule } from '@angular/core';

import { LoadingExamplesModule } from './loading/loading-examples.module';

const EXAMPLES = [LoadingExamplesModule];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES,
})
export class ExamplesModule {}
