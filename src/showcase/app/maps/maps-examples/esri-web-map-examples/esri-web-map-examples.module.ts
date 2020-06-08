import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriWebMapModule } from '@sbb-esta/angular-maps/esri-web-map';

import { provideExamples } from '../../../shared/example-provider';

import { EsriWebMapExampleComponent } from './esri-web-map-example/esri-web-map-example.component';

const EXAMPLES = [EsriWebMapExampleComponent];

const EXAMPLE_INDEX = {
  'esri-web-map-example': EsriWebMapExampleComponent,
};

@NgModule({
  imports: [CommonModule, EsriWebMapModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('maps', 'esri', EXAMPLE_INDEX)],
})
export class EsriWebMapExamplesModule {}
