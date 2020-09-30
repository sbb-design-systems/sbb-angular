import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { SbbAutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';

import { SbbSearch, SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER } from './search/search.component';

@NgModule({
  declarations: [SbbSearch],
  imports: [
    CommonModule,
    SbbIconModule,
    SbbIconDirectiveModule,
    PortalModule,
    OverlayModule,
    SbbAutocompleteModule,
    SbbButtonModule,
  ],
  exports: [SbbSearch, PortalModule, OverlayModule, SbbIconDirectiveModule],
  providers: [SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbSearchModule {}
