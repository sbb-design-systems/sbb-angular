import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbUsermenu } from './usermenu';
import { SbbUsermenuIcon } from './usermenu-icon';

@NgModule({
  declarations: [SbbUsermenu, SbbUsermenuIcon],
  imports: [CommonModule, SbbCommonModule, SbbIconModule, SbbMenuModule],
  exports: [SbbUsermenu, SbbUsermenuIcon],
})
export class SbbUsermenuModule {}
