import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconExclamationPointModule,
  IconSignExclamationPointModule,
  IconSignXModule,
  IconTickModule
} from '@sbb-esta/angular-icons';

import { StatusComponent } from './status/status.component';

@NgModule({
  imports: [
    CommonModule,
    IconDirectiveModule,
    IconTickModule,
    IconExclamationPointModule,
    IconSignExclamationPointModule,
    IconSignXModule
  ],
  declarations: [StatusComponent],
  exports: [StatusComponent]
})
export class StatusModule {}
