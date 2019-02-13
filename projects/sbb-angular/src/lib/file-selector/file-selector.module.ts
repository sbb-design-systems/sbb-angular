import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { FileSelectorTypesService } from './file-selector/file-selector-types.service';
import { IconDocumentsModule } from '../svg-icons-components/svg-icons-components';

@NgModule({
  declarations: [
    FileSelectorComponent
  ],
  imports: [
    CommonModule,
    IconDocumentsModule
  ],
  exports: [
    FileSelectorComponent
  ],
  providers: [
    FileSelectorTypesService
  ]
})
export class FileSelectorModule { }
