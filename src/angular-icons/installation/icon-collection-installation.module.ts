import { NgModule } from '@angular/core';

import { IconConstructionModule } from './icon-construction.module';
import { IconRailwaySwitchModule } from './icon-railway-switch.module';
import { IconTrainSignalModule } from './icon-train-signal.module';
import { IconTrainTracksModule } from './icon-train-tracks.module';

const modules = [
  IconRailwaySwitchModule,
  IconTrainSignalModule,
  IconTrainTracksModule,
  IconConstructionModule,
];

/**
 * @Deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionInstallationModule {}
