import { NgModule } from '@angular/core';

import { IconCircleMinusModule } from './icon-circle-minus.module';
import { IconCirclePlusModule } from './icon-circle-plus.module';
import { IconContextMenuModule } from './icon-context-menu.module';
import { IconCrossModule } from './icon-cross.module';
import { IconDragModule } from './icon-drag.module';
import { IconHamburgerMenuModule } from './icon-hamburger-menu.module';
import { IconHouseModule } from './icon-house.module';
import { IconLayersModule } from './icon-layers.module';
import { IconMinusModule } from './icon-minus.module';
import { IconPlusModule } from './icon-plus.module';
import { IconTwoFingerTapModule } from './icon-two-finger-tap.module';

const modules = [
  IconCircleMinusModule,
  IconCirclePlusModule,
  IconContextMenuModule,
  IconCrossModule,
  IconDragModule,
  IconHamburgerMenuModule,
  IconHouseModule,
  IconLayersModule,
  IconMinusModule,
  IconPlusModule,
  IconTwoFingerTapModule,
];

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionNavigationModule {}
