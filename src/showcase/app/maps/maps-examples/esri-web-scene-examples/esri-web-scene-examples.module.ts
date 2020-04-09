import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { EsriWebSceneExampleComponent } from './esri-web-scene-example/esri-web-scene-example.component';

const EXAMPLES = [EsriWebSceneExampleComponent];

@NgModule({
  imports: [CommonModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class EsriWebSceneExamplesModule {}
