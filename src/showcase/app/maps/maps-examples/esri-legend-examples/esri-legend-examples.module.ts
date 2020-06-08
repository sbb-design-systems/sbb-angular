import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriLegendModule } from '@sbb-esta/angular-maps/esri-legend';
import { EsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { provideExamples } from '../../../shared/example-provider';

import { EsriLegendExampleComponent } from './esri-legend-example/esri-legend-example.component';

const EXAMPLES = [EsriLegendExampleComponent];

const EXAMPLE_INDEX = {
  'esri-legend-example': EsriLegendExampleComponent,
};

@NgModule({
  imports: [CommonModule, EsriLegendModule, EsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri', EXAMPLE_INDEX)],
})
export class EsriLegendExamplesModule {}
