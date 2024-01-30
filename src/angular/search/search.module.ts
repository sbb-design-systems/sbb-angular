import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbHeaderSearch, SBB_SEARCH_SCROLL_STRATEGY_PROVIDER } from './header-search';
import { SbbSearch } from './search';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    SbbCommonModule,
    SbbButtonModule,
    SbbIconModule,
    SbbSearch,
    SbbHeaderSearch,
  ],
  exports: [SbbSearch, SbbHeaderSearch],
  providers: [SBB_SEARCH_SCROLL_STRATEGY_PROVIDER],
})
export class SbbSearchModule {}
