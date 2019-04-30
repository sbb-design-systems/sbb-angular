import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { ButtonModule } from '../button/button.module';
import {
  IconDocumentTextModule,
  IconDocumentImageModule,
  IconDocumentPdfModule,
  IconDocumentSoundModule,
  IconDocumentVideoModule,
  IconDocumentZipModule,
  IconDocumentStandardModule,
  IconTrashModule,
  IconUploadModule,
} from 'sbb-angular-icons';
import { FileExtension, FileNameNoExtension, FileSizeFormatted } from './file-selector/file-selector.pipes';

@NgModule({
  declarations: [
    FileSelectorComponent,
    FileExtension,
    FileNameNoExtension,
    FileSizeFormatted
  ],
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
  exports: [
    FileSelectorComponent
  ]
})
export class FileSelectorModule { }
