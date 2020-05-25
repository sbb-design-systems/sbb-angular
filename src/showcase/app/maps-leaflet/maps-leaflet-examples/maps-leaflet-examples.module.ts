import { NgModule } from '@angular/core';

import { LeafletMapExamplesModule } from './leaflet-map-examples/leaflet-map-examples.module';

const EXAMPLES = [LeafletMapExamplesModule];

@NgModule({
  imports: EXAMPLES,
  exports: EXAMPLES,
})
export class MapsLeafletExamplesModule {}
