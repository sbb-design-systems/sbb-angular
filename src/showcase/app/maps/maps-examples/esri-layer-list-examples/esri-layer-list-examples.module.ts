import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriLayerListModule } from '@sbb-esta/angular-maps/esri-layer-list';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { provideExamples } from '../../../shared/example-provider';

import { EsriLayerListExampleComponent } from './esri-layer-list-example/esri-layer-list-example.component';

const EXAMPLES = [EsriLayerListExampleComponent];

const EXAMPLE_INDEX = {
  'esri-layer-list-example': EsriLayerListExampleComponent,
};

@NgModule({
  imports: [CommonModule, EsriLayerListModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri-layer-list', EXAMPLE_INDEX)],
})
export class EsriLayerListExamplesModule {}
