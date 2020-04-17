import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriBasemapGalleryModule } from '@sbb-esta/angular-maps/esri-basemap-gallery';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriBasemapGalleryExampleComponent } from './esri-basemap-gallery-example/esri-basemap-gallery-example.component';

const EXAMPLES = [EsriBasemapGalleryExampleComponent];

@NgModule({
  imports: [CommonModule, EsriBasemapGalleryModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class EsriBasemapGalleryExamplesModule {}
