import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbEsriLayerList } from './esri-layer-list/esri-layer-list.component';

@NgModule({
  declarations: [SbbEsriLayerList],
  imports: [CommonModule],
  exports: [SbbEsriLayerList],
})
export class SbbEsriLayerListModule {}
