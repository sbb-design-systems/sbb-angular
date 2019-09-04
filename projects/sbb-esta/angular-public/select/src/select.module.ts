import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconChevronSmallDownModule } from '@sbb-esta/angular-icons';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { OptionModule } from '../option/option.module';

import { SBB_SELECT_SCROLL_STRATEGY_PROVIDER, SelectComponent } from './select/select.component';

@NgModule({
  imports: [
    IconChevronSmallDownModule,
    OptionModule,
    CommonModule,
    OverlayModule,
    PerfectScrollbarModule
  ],
  declarations: [SelectComponent],
  exports: [OptionModule, OverlayModule, SelectComponent, PerfectScrollbarModule],
  providers: [SBB_SELECT_SCROLL_STRATEGY_PROVIDER]
})
export class SelectModule {}
