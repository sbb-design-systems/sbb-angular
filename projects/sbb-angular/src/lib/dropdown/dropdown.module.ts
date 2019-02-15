import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown/dropdown.component';
import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownOriginDirective } from './dropdown-origin.directive';
import { DropdownTriggerDirective, DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER } from './dropdown-trigger.directive';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective
  ],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective
  ],
  providers: [
    DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER
  ]
})
export class DropdownModule { }
