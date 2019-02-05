import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown/dropdown.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownOriginDirective } from './dropdown-origin.directive';
import { DropdownTriggerDirective, DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER } from './dropdown-trigger.directive';

@NgModule({
  declarations: [
    DropdownComponent,
    DropdownItemDirective,
    DropdownOriginDirective,
    DropdownTriggerDirective
  ],
  imports: [
    CommonModule,
    IconCommonModule
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
