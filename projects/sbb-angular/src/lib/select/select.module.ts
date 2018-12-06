import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select/select.component';
import { OptionModule } from '../option/option.module';

@NgModule({
  imports: [
    CommonModule,
    OptionModule
  ],
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent
  ]
})
export class SelectModule { }
