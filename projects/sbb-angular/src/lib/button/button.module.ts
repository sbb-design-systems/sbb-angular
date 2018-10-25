import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { ButtonIconDirective } from './button/button-icon.directive';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
  ],
  declarations: [
    ButtonComponent,
    ButtonIconDirective
  ],
  exports: [
    ButtonComponent,
    ButtonIconDirective
  ],
  entryComponents: [ ]
})
export class ButtonModule { }
