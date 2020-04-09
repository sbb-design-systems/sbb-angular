import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriLegendModule } from '@sbb-esta/angular-maps/esri-legend';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriLegendExampleComponent } from './esri-legend-example/esri-legend-example.component';

const EXAMPLES = [EsriLegendExampleComponent];

@NgModule({
  imports: [CommonModule, EsriLegendModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class EsriLegendExamplesModule {}
