import { NgModule } from '@angular/core';

import { IconExamplesModule } from './icon-examples/icon-examples.module';

const EXAMPLES = [IconExamplesModule];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES,
})
export class CoreExamplesModule {}
