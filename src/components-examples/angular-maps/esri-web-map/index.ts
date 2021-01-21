import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriWebMapModule } from '@sbb-esta/angular-maps/esri-web-map';

import { EsriWebMapExample } from './esri-web-map/esri-web-map-example';

export { EsriWebMapExample };

const EXAMPLES = [EsriWebMapExample];

@NgModule({
  imports: [CommonModule, SbbEsriWebMapModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class EsriWebMapExamplesModule {}
