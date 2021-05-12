import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbFileSelector } from './file-selector/file-selector.component';
import {
  SbbFileExtension,
  SbbFileNameNoExtension,
  SbbFileSizeFormatted,
} from './file-selector/file-selector.pipes';

@NgModule({
  declarations: [SbbFileSelector, SbbFileExtension, SbbFileNameNoExtension, SbbFileSizeFormatted],
  imports: [CommonModule, SbbIconModule],
  exports: [SbbFileSelector],
})
export class SbbFileSelectorModule {}
