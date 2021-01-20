import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriWebSceneExample } from './esri-web-scene/esri-web-scene-example';

export { EsriWebSceneExample };

const EXAMPLES = [EsriWebSceneExample];

@NgModule({
  imports: [CommonModule, SbbEsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriWebSceneExamplesModule {}
