import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { OptionModule } from '@sbb-esta/angular-public/option';

import { SBB_SELECT_SCROLL_STRATEGY_PROVIDER, SelectComponent } from './select/select.component';

@NgModule({
  imports: [SbbIconModule, OptionModule, CommonModule, OverlayModule],
  declarations: [SelectComponent],
  exports: [OptionModule, OverlayModule, SelectComponent],
  providers: [SBB_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class SelectModule {}
