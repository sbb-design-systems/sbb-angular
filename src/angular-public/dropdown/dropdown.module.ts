import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbDropdownItem } from './dropdown-item.directive';
import { SbbDropdownOrigin } from './dropdown-origin.directive';
import {
  SbbDropdownTrigger,
  SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './dropdown-trigger.directive';
import { SbbDropdown } from './dropdown/dropdown.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  exports: [SbbDropdown, SbbDropdownItem, SbbDropdownOrigin, SbbDropdownTrigger],
  declarations: [SbbDropdown, SbbDropdownItem, SbbDropdownOrigin, SbbDropdownTrigger],
  providers: [SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbDropdownModule {}
