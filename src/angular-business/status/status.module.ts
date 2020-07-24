import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { StatusComponent } from './status.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [StatusComponent],
  exports: [StatusComponent],
})
export class StatusModule {}
