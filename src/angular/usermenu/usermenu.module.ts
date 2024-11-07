import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbUsermenu } from './usermenu';
import { SbbUsermenuIcon } from './usermenu-icon';

@NgModule({
  imports: [SbbCommonModule, SbbIconModule, SbbMenuModule, SbbUsermenu, SbbUsermenuIcon],
  exports: [SbbUsermenu, SbbUsermenuIcon],
})
export class SbbUsermenuModule {}
