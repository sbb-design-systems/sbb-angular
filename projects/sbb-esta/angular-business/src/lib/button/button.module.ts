import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonIconDirective } from '../../../../angular-public/src/lib/button/button/button-icon.directive';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonComponent, ButtonIconDirective],
  exports: [ButtonComponent, ButtonIconDirective],
  entryComponents: []
})
export class ButtonModule {}
