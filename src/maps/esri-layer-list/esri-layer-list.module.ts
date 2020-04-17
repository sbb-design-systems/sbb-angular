import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriLayerListComponent } from './esri-layer-list/esri-layer-list.component';

@NgModule({
  declarations: [EsriLayerListComponent],
  imports: [CommonModule],
  exports: [EsriLayerListComponent]
})
export class EsriLayerListModule {}
