import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionModule } from '../option/option.module';
import { SelectComponent, SBB_SELECT_SCROLL_STRATEGY_PROVIDER } from './select/select.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconCommonModule } from '../svg-icons-components/svg-icons-components';

@NgModule({
  imports: [
    IconCommonModule,
    OptionModule,
    CommonModule,
    OverlayModule
  ],
  declarations: [
    SelectComponent
  ],
  exports: [
    OptionModule,
    OverlayModule,
    SelectComponent
  ],
  providers: [
    SBB_SELECT_SCROLL_STRATEGY_PROVIDER
  ]
})
export class SelectModule { }
