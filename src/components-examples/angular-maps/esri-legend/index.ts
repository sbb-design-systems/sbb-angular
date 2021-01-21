import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriLegendModule } from '@sbb-esta/angular-maps/esri-legend';
import { SbbEsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriLegendExample } from './esri-legend/esri-legend-example';

export { EsriLegendExample };
const EXAMPLES = [EsriLegendExample];

@NgModule({
  imports: [CommonModule, SbbEsriLegendModule, SbbEsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriLegendExamplesModule {}
