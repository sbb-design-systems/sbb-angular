import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { ButtonModule } from '../button/button.module';
import { IconCollectionBaseDocumentsModule, IconTrashModule, IconUploadModule } from '../svg-icons/svg-icons';
import { GetFileExtension, GetFileNameNoExtension, GetFileSizeFormatted } from './file-selector/file-selector.pipes';

@NgModule({
  declarations: [
    FileSelectorComponent,
    GetFileExtension,
    GetFileNameNoExtension,
    GetFileSizeFormatted
  ],
  imports: [
    CommonModule,
    ButtonModule,
    IconCollectionBaseDocumentsModule,
    IconTrashModule,
    IconUploadModule
  ],
  exports: [
    FileSelectorComponent
  ]
})
export class FileSelectorModule { }
