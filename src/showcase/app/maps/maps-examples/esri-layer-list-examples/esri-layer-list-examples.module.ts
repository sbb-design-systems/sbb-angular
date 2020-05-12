import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriLayerListModule } from '@sbb-esta/angular-maps/esri-layer-list';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriLayerListExampleComponent } from './esri-layer-list-example/esri-layer-list-example.component';

const EXAMPLES = [EsriLayerListExampleComponent];

@NgModule({
  imports: [CommonModule, EsriLayerListModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriLayerListExamplesModule {}
