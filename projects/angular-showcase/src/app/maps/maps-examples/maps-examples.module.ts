import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  EsriBasemapGalleryModule,
  EsriWebMapModule,
  EsriWebSceneModule,
  EsriLegendModule,
  EsriLayerListModule
} from '@sbb-esta/angular-maps';
import { EsriConfigModule } from '@sbb-esta/angular-maps';

import { EsriBasemapGalleryShowcaseComponent } from './esri-basemap-gallery-showcase/esri-basemap-gallery-showcase.component';
import { EsriWebMapShowcaseComponent } from './esri-web-map-showcase/esri-web-map-showcase.component';
import { EsriWebSceneShowcaseComponent } from './esri-web-scene-showcase/esri-web-scene-showcase.component';

const showcaseComponents = [
  EsriWebMapShowcaseComponent,
  EsriWebSceneShowcaseComponent,
  EsriBasemapGalleryShowcaseComponent
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
