import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, DropdownModule } from '@sbb-esta/angular-public';

import { IconContextMenuModule } from '../../../../angular-icons/src/lib';
// import { DropdownModule } from '../../../../angular-public/src/lib/dropdown/dropdown.module';

import { ContextmenuComponent } from './contextmenu/contextmenu.component';

@NgModule({
  imports: [CommonModule, IconContextMenuModule, ButtonModule, DropdownModule],
  declarations: [ContextmenuComponent],
  exports: [ContextmenuComponent]
})
export class ContextmenuModule {}
