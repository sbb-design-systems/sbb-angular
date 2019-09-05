import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { IconMagnifyingGlassModule } from '@sbb-esta/angular-icons';
import { AutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { ButtonModule } from '@sbb-esta/angular-public/button';

import { SearchIconDirective } from './search-icon.directive';
import {
  SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER,
  SearchComponent
} from './search/search.component';

@NgModule({
  declarations: [SearchComponent, SearchIconDirective],
  imports: [
    CommonModule,
    IconMagnifyingGlassModule,
    IconDirectiveModule,
    PortalModule,
    OverlayModule,
    AutocompleteModule,
    ButtonModule
  ],
  exports: [SearchComponent, PortalModule, OverlayModule, SearchIconDirective, IconDirectiveModule],
  providers: [SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class SearchModule {}
