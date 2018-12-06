import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionModule } from '../option/option.module';
import { SelectComponent, SBB_SELECT_SCROLL_STRATEGY_PROVIDER } from './select/select.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    OptionModule,
    CommonModule,
    OverlayModule
  ],
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent,
    OverlayModule,
    OptionModule
  ],
  providers: [
    SBB_SELECT_SCROLL_STRATEGY_PROVIDER
  ]
})
export class SelectModule { }
