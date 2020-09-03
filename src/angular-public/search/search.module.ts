import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { AutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { ButtonModule } from '@sbb-esta/angular-public/button';

import {
  SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER,
  SearchComponent,
} from './search/search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SbbIconModule,
    IconDirectiveModule,
    PortalModule,
    OverlayModule,
    AutocompleteModule,
    ButtonModule,
  ],
  exports: [SearchComponent, PortalModule, OverlayModule, IconDirectiveModule],
  providers: [SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SearchModule {}
