import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { FileSelectorTypesService } from './file-selector/file-selector-types.service';

@NgModule({
  declarations: [
    FileSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FileSelectorComponent
  ],
  providers: [
    FileSelectorTypesService
  ]
})
export class FileSelectorModule { }
