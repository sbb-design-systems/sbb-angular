import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriLayerListModule } from '@sbb-esta/angular-maps/esri-layer-list';
import { SbbEsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriLayerListExample } from './esri-layer-list/esri-layer-list-example';

export { EsriLayerListExample };
const EXAMPLES = [EsriLayerListExample];

@NgModule({
  imports: [CommonModule, SbbEsriLayerListModule, SbbEsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class Index {}
