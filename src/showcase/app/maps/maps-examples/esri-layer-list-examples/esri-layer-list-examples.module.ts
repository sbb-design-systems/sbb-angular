import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriLayerListModule } from '@sbb-esta/angular-maps/esri-layer-list';
import { SbbEsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { provideExamples } from '../../../shared/example-provider';

import { EsriLayerListExampleComponent } from './esri-layer-list-example/esri-layer-list-example.component';

const EXAMPLES = [EsriLayerListExampleComponent];

const EXAMPLE_INDEX = {
  'esri-layer-list-example': EsriLayerListExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbEsriLayerListModule, SbbEsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri-layer-list', EXAMPLE_INDEX)],
})
export class EsriLayerListExamplesModule {}
