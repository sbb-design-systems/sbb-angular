import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriLayerListComponent } from './esri-layer-list/esri-layer-list.component';
import { EsriTypesService } from './esri-types/esri-types.service';

@NgModule({
  declarations: [EsriLayerListComponent],
  providers: [EsriTypesService],
  imports: [CommonModule],
  exports: [EsriLayerListComponent]
})
export class EsriLayerListModule {}
