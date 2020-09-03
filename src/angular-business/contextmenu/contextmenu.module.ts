import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { ContextmenuComponent } from './contextmenu/contextmenu.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, DropdownModule],
  declarations: [ContextmenuComponent],
  exports: [ContextmenuComponent, DropdownModule],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class ContextmenuModule {}
