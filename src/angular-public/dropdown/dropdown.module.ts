import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownOriginDirective } from './dropdown-origin.directive';
import {
  DropdownTriggerDirective,
  DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './dropdown-trigger.directive';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  exports: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective,
  ],
  declarations: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective,
  ],
  providers: [DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class DropdownModule {}
