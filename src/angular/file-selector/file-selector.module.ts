import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbFileSelector } from './file-selector';

@NgModule({
  declarations: [SbbFileSelector],
  imports: [CommonModule, SbbCommonModule, SbbIconModule],
  exports: [SbbFileSelector],
})
export class SbbFileSelectorModule {}
