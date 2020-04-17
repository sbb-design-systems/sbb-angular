import { NgModule } from '@angular/core';

import { EsriBasemapGalleryExamplesModule } from './esri-basemap-gallery-examples/esri-basemap-gallery-examples.module';
import { EsriLayerListExamplesModule } from './esri-layer-list-examples/esri-layer-list-examples.module';
import { EsriLegendExamplesModule } from './esri-legend-examples/esri-legend-examples.module';
import { EsriWebMapExamplesModule } from './esri-web-map-examples/esri-web-map-examples.module';
import { EsriWebSceneExamplesModule } from './esri-web-scene-examples/esri-web-scene-examples.module';

const EXAMPLES = [
  EsriBasemapGalleryExamplesModule,
  EsriLayerListExamplesModule,
  EsriLegendExamplesModule,
  EsriWebMapExamplesModule,
  EsriWebSceneExamplesModule
];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES
})
export class MapsExamplesModule {}
