import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconDirectiveModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbUsermenu } from './usermenu';

@NgModule({
  declarations: [SbbUsermenu],
  imports: [CommonModule, SbbIconModule, OverlayModule, SbbIconDirectiveModule, SbbMenuModule],
  exports: [SbbUsermenu, SbbIconDirectiveModule],
})
export class SbbUsermenuModule {}
