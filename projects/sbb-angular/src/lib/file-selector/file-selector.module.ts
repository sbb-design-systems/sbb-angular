import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { FileSelectorTypesService } from './file-selector/file-selector-types.service';
import { IconCommonModule } from '../svg-icons-components/svg-icons-components';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [
    FileSelectorComponent
  ],
  imports: [
    CommonModule,
    IconCommonModule,
    ButtonModule
  ],
  exports: [
    FileSelectorComponent
  ],
  providers: [
    FileSelectorTypesService
  ]
})
export class FileSelectorModule { }
