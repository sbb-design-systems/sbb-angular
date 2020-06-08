import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { provideExamples } from '../../../shared/example-provider';

import { EsriWebSceneExampleComponent } from './esri-web-scene-example/esri-web-scene-example.component';

const EXAMPLES = [EsriWebSceneExampleComponent];

const EXAMPLE_INDEX = {
  'esri-web-scene-example': EsriWebSceneExampleComponent,
};

@NgModule({
  imports: [CommonModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri', EXAMPLE_INDEX)],
})
export class EsriWebSceneExamplesModule {}
