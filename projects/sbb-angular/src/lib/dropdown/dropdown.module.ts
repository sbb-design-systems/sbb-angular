import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown/dropdown.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';

@NgModule({
  declarations: [DropdownComponent],
  imports: [
    CommonModule,
    IconCommonModule
  ],
  exports: [DropdownComponent]
})
export class DropdownModule { }
