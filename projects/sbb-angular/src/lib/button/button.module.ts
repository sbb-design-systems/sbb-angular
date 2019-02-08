import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { ButtonIconDirective } from './button/button-icon.directive';

@NgModule({
  imports: [
    CommonModule,
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
