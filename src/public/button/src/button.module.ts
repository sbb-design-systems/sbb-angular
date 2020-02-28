import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [CommonModule, IconDirectiveModule],
  declarations: [ButtonComponent],
  exports: [ButtonComponent, IconDirectiveModule],
  entryComponents: []
})
export class ButtonModule {}
