import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbButton } from './button/button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbButton],
  exports: [SbbButton, SbbIconDirectiveModule],
})
export class SbbButtonModule {}
