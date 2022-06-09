import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';

import { LoadingIndicatorFullboxExample } from './loading-indicator-fullbox/loading-indicator-fullbox-example';
import { LoadingIndicatorInlineExample } from './loading-indicator-inline/loading-indicator-inline-example';
import { LoadingIndicatorSimpleExample } from './loading-indicator-simple/loading-indicator-simple-example';

export {
  LoadingIndicatorFullboxExample,
  LoadingIndicatorInlineExample,
  LoadingIndicatorSimpleExample,
};

const EXAMPLES = [
  LoadingIndicatorFullboxExample,
  LoadingIndicatorInlineExample,
  LoadingIndicatorSimpleExample,
];

@NgModule({
  imports: [CommonModule, SbbButtonModule, SbbLoadingIndicatorModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LoadingExamplesModule {}
