import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbHeaderSearch, SBB_SEARCH_SCROLL_STRATEGY_PROVIDER } from './header-search';
import { SbbSearch } from './search';

@NgModule({
  declarations: [SbbSearch, SbbHeaderSearch],
  imports: [CommonModule, PortalModule, OverlayModule, SbbButtonModule, SbbIconModule],
  exports: [SbbSearch, SbbHeaderSearch],
  providers: [SBB_SEARCH_SCROLL_STRATEGY_PROVIDER],
})
export class SbbSearchModule {}
