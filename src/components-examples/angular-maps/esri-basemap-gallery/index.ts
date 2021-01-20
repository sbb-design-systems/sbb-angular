import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriBasemapGalleryModule } from '@sbb-esta/angular-maps/esri-basemap-gallery';
import { SbbEsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriBasemapGalleryExample } from './esri-basemap-gallery/esri-basemap-gallery-example';

export { EsriBasemapGalleryExample };

const EXAMPLES = [EsriBasemapGalleryExample];

@NgModule({
  imports: [CommonModule, SbbEsriBasemapGalleryModule, SbbEsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriBasemapGalleryExamplesModule {}
