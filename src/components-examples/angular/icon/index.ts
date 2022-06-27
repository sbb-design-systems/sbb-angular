import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { IconSimpleExample } from './icon-simple/icon-simple-example';

export { IconSimpleExample };

const EXAMPLES = [IconSimpleExample];

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class IconExamplesModule {}
