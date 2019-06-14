import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  IconDocumentImageModule,
  IconDocumentPdfModule,
  IconDocumentSoundModule,
  IconDocumentStandardModule,
  IconDocumentTextModule,
  IconDocumentVideoModule,
  IconDocumentZipModule,
  IconTrashModule,
  IconUploadModule
} from '@sbb-esta/angular-icons';

import { ButtonModule } from '../button/button.module';

import { FileSelectorComponent } from './file-selector/file-selector.component';
import {
  FileExtension,
  FileNameNoExtension,
  FileSizeFormatted
} from './file-selector/file-selector.pipes';

@NgModule({
  declarations: [FileSelectorComponent, FileExtension, FileNameNoExtension, FileSizeFormatted],
  imports: [
    CommonModule,
    ButtonModule,
    IconDocumentTextModule,
    IconDocumentImageModule,
    IconDocumentPdfModule,
    IconDocumentSoundModule,
    IconDocumentVideoModule,
    IconDocumentZipModule,
    IconDocumentStandardModule,
    IconTrashModule,
    IconUploadModule
  ],
  exports: [FileSelectorComponent]
})
export class FileSelectorModule {}
