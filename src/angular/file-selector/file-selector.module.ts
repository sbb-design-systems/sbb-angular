import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbFileSelector } from './file-selector';

@NgModule({
  declarations: [SbbFileSelector],
  imports: [SbbCommonModule, SbbIconModule],
  exports: [SbbFileSelector],
})
export class SbbFileSelectorModule {}
