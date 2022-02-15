import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';

import { LoadingFullboxExample } from './loading-fullbox/loading-fullbox-example';
import { LoadingInlineExample } from './loading-inline/loading-inline-example';
import { LoadingSimpleExample } from './loading-simple/loading-simple-example';

export { LoadingFullboxExample, LoadingInlineExample, LoadingSimpleExample };

const EXAMPLES = [LoadingFullboxExample, LoadingInlineExample, LoadingSimpleExample];

@NgModule({
  imports: [CommonModule, SbbButtonModule, SbbLoadingModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LoadingExamplesModule {}
