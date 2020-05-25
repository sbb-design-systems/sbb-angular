import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletMapModule } from '@sbb-esta/angular-maps-leaflet/leaflet-map';
import { ButtonModule } from '@sbb-esta/angular-public/button';

import { LeafletMapExampleComponent } from './leaflet-map-example/leaflet-map-example.component';

const EXAMPLES = [LeafletMapExampleComponent];

@NgModule({
  imports: [CommonModule, LeafletMapModule, ButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LeafletMapExamplesModule {}
