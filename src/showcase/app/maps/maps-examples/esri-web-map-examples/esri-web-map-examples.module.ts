import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriWebMapModule } from '@sbb-esta/angular-maps/esri-web-map';

import { EsriWebMapExampleComponent } from './esri-web-map-example/esri-web-map-example.component';

const EXAMPLES = [EsriWebMapExampleComponent];

@NgModule({
  imports: [CommonModule, EsriWebMapModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriWebMapExamplesModule {}
