import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { FileSelectorTypesService } from './file-selector/file-selector-types.service';
import { ButtonModule } from '../button/button.module';
import { IconCollectionBaseDocumentsModule, IconTrashModule, IconUploadModule } from '../svg-icons/svg-icons';

@NgModule({
  declarations: [
    FileSelectorComponent
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
  ],
  providers: [
    FileSelectorTypesService
  ]
})
export class FileSelectorModule { }
