import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';

import { IconCommonModule } from '../svg-icons-components/icon-common.module';

import { IconDownloadComponent } from '../svg-icons-components/base/arrows/sbb-icon-download.component';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
  ],
  declarations: [
    ButtonComponent
  ],
  exports: [
    ButtonComponent
  ],
  entryComponents: [ ]
})
export class ButtonModule { }
