import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownOriginDirective } from './dropdown-origin.directive';
import {
  DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER,
  DropdownTriggerDirective
} from './dropdown-trigger.directive';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
  declarations: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective
  ],
  imports: [CommonModule, OverlayModule],
  exports: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective
  ],
  providers: [DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class DropdownModule {}
