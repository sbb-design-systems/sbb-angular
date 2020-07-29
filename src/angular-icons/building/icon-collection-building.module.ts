import { NgModule } from '@angular/core';

import { IconBuildingTreeModule } from './icon-building-tree.module';
import { IconCityModule } from './icon-city.module';

const modules = [IconBuildingTreeModule, IconCityModule];

/**
 * @deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionBuildingModule {}
