import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { IconFitExample } from './icon-fit/icon-fit-example';
import { IconSimpleExample } from './icon-simple/icon-simple-example';

export { IconSimpleExample, IconFitExample };

const EXAMPLES = [IconSimpleExample, IconFitExample];

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class IconExamplesModule {}
