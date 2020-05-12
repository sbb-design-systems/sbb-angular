import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';

@NgModule({
  declarations: [LeafletMapComponent],
  providers: [],
  imports: [CommonModule],
  exports: [LeafletMapComponent]
})
export class LeafletMapModule {}
