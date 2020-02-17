import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriWebMapComponent } from './esri-web-map/esri-web-map.component';

@NgModule({
  declarations: [EsriWebMapComponent],
  providers: [],
  imports: [CommonModule],
  exports: [EsriWebMapComponent]
})
export class EsriWebMapModule {}
