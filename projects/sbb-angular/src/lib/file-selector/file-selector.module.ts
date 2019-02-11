import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';

@NgModule({
  declarations: [FileSelectorComponent],
  imports: [
    CommonModule
  ],
  exports: [FileSelectorComponent]
})
export class FileSelectorModule { }
