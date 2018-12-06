import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select/select.component';
import { OptionModule } from '../option/option.module';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    OptionModule,
    OverlayModule
  ],
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent,
    OptionModule,
    OverlayModule
  ]
})
export class SelectModule { }
