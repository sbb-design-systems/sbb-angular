import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbFileSelector } from './file-selector';

@NgModule({
  imports: [SbbCommonModule, SbbIconModule, SbbFileSelector],
  exports: [SbbFileSelector],
})
export class SbbFileSelectorModule {}
