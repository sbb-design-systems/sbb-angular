import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconMagnifyingGlassModule } from 'sbb-angular-icons';

import { AutocompleteModule } from '../autocomplete/autocomplete';
import { ButtonModule } from '../button/button.module';
import { OptionModule } from '../option/option.module';

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
    PortalModule,
    OverlayModule,
    AutocompleteModule,
    ButtonModule,
    OptionModule
  ],
  exports: [SearchComponent, PortalModule, OverlayModule, SearchIconDirective],
  providers: [SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class SearchModule {}
