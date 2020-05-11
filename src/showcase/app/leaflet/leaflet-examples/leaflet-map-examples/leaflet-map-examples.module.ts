import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletMapModule } from '@sbb-esta/angular-leaflet/leaflet-map';

import { LeafletMapExampleComponent } from './leaflet-map-example/leaflet-map-example.component';

const EXAMPLES = [LeafletMapExampleComponent];

@NgModule({
  imports: [CommonModule, LeafletMapModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class LeafletMapExamplesModule {}
