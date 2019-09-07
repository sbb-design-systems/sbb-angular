import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { ButtonIconDirective } from './button/button-icon.directive';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [CommonModule, IconDirectiveModule],
  declarations: [ButtonComponent, ButtonIconDirective],
  exports: [ButtonComponent, ButtonIconDirective, IconDirectiveModule],
  entryComponents: []
})
export class ButtonModule {}
