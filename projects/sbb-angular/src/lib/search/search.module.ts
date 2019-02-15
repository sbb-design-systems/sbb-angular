import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent, SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER } from './search/search.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { AutocompleteModule } from '../autocomplete/autocomplete';
import { ButtonModule } from '../button/button.module';
import { OptionModule } from '../option/option.module';
import { IconSearchModule } from '../svg-icons/svg-icons';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    IconSearchModule,
    PortalModule,
    OverlayModule,
    AutocompleteModule,
    ButtonModule,
    OptionModule
  ],
  exports: [
    SearchComponent,
    PortalModule,
    OverlayModule,
  ],
  providers: [
    SBB_SEARCH_SCROLL_STRATEGY_FACTORY_PROVIDER

  ]
})
export class SearchModule { }
