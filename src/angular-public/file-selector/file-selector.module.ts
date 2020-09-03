import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { FileSelectorComponent } from './file-selector/file-selector.component';
import {
  FileExtension,
  FileNameNoExtension,
  FileSizeFormatted,
} from './file-selector/file-selector.pipes';

@NgModule({
  declarations: [FileSelectorComponent, FileExtension, FileNameNoExtension, FileSizeFormatted],
  imports: [CommonModule, SbbIconModule],
  exports: [FileSelectorComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class FileSelectorModule {}
