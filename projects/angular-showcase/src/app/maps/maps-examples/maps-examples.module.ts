import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  EsriBasemapGalleryModule,
  EsriConfigModule,
  EsriLayerListModule,
  EsriLegendModule,
  EsriWebMapModule,
  EsriWebSceneModule
} from '@sbb-esta/angular-maps';

import { EsriBasemapGalleryShowcaseComponent } from './esri-basemap-gallery-showcase/esri-basemap-gallery-showcase.component';
import { EsriLayerListShowcaseComponent } from './esri-layer-list-showcase/esri-layer-list-showcase.component';
import { EsriLegendShowcaseComponent } from './esri-legend-showcase/esri-legend-showcase.component';
import { EsriWebMapShowcaseComponent } from './esri-web-map-showcase/esri-web-map-showcase.component';
import { EsriWebSceneShowcaseComponent } from './esri-web-scene-showcase/esri-web-scene-showcase.component';

const showcaseComponents = [
  EsriWebMapShowcaseComponent,
  EsriWebSceneShowcaseComponent,
  EsriBasemapGalleryShowcaseComponent,
  EsriLegendShowcaseComponent,
  EsriLayerListShowcaseComponent
];
@NgModule({
  declarations: showcaseComponents,
  entryComponents: showcaseComponents,
  exports: showcaseComponents,
  imports: [
    CommonModule,
    EsriWebMapModule,
    EsriWebSceneModule,
    EsriBasemapGalleryModule,
    EsriLayerListModule,
    EsriLegendModule,
    EsriConfigModule.forRoot({ portalUrl: 'https://www.arcgis.com' })
  ]
})
export class MapsExamplesModule {}
