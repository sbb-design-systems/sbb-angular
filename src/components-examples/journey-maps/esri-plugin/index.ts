import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbEsriPluginModule, SbbJourneyMapsModule } from '@sbb-esta/journey-maps';

import { EsriPluginExample } from './esri-plugin/esri-plugin-example';

export { EsriPluginExample };
const EXAMPLES = [EsriPluginExample];

@NgModule({
  imports: [
    CommonModule,
    SbbJourneyMapsModule,
    SbbNotificationModule,
    SbbEsriPluginModule,
    EXAMPLES,
  ],
  exports: [EXAMPLES],
})
export class EsriPluginExamplesModule {}
