import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriLegendModule } from '@sbb-esta/angular-maps/esri-legend';
import { SbbEsriWebSceneModule } from '@sbb-esta/angular-maps/esri-web-scene';

import { provideExamples } from '../../../shared/example-provider';

import { EsriLegendExampleComponent } from './esri-legend-example/esri-legend-example.component';

const EXAMPLES = [EsriLegendExampleComponent];

const EXAMPLE_INDEX = {
  'esri-legend-example': EsriLegendExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbEsriLegendModule, SbbEsriWebSceneModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri-legend', EXAMPLE_INDEX)],
})
export class EsriLegendExamplesModule {}
