import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriTypesService } from './esri-types/esri-types.service';
import { EsriWebMapComponent } from './esri-web-map/esri-web-map.component';

@NgModule({
  declarations: [EsriWebMapComponent],
  providers: [EsriTypesService],
  imports: [CommonModule],
  exports: [EsriWebMapComponent]
})
export class EsriWebMapModule {}
