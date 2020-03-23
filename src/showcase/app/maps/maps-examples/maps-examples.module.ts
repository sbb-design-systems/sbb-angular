import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriBasemapGalleryModule } from '@sbb-esta/angular-maps/esri-basemap-gallery';
import { EsriLayerListModule } from '@sbb-esta/angular-maps/esri-layer-list';
import { EsriLegendModule } from '@sbb-esta/angular-maps/esri-legend';
import { EsriWebMapModule } from '@sbb-esta/angular-maps/esri-web-map';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

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
    EsriLegendModule
  ]
})
export class MapsExamplesModule {}
