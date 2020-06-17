import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconCrossModule } from '@sbb-esta/angular-icons/navigation';
import { IconExclamationPointModule, IconTickModule } from '@sbb-esta/angular-icons/status';

import { StatusComponent } from './status.component';

@NgModule({
  imports: [CommonModule, IconCrossModule, IconTickModule, IconExclamationPointModule],
  declarations: [StatusComponent],
  exports: [StatusComponent],
})
export class StatusModule {}
