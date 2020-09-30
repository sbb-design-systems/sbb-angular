import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

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
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbFileSelectorModule {}
