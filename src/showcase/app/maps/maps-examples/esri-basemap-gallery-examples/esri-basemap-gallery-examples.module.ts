import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriBasemapGalleryModule } from '@sbb-esta/angular-maps/esri-basemap-gallery';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { provideExamples } from '../../../shared/example-provider';

import { EsriBasemapGalleryExampleComponent } from './esri-basemap-gallery-example/esri-basemap-gallery-example.component';

const EXAMPLES = [EsriBasemapGalleryExampleComponent];

const EXAMPLE_INDEX = {
  'esri-basemap-gallery-example': EsriBasemapGalleryExampleComponent,
};

@NgModule({
  imports: [CommonModule, EsriBasemapGalleryModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri', EXAMPLE_INDEX)],
})
export class EsriBasemapGalleryExamplesModule {}
