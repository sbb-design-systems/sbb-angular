import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriLegendComponent } from './esri-legend/esri-legend.component';

@NgModule({
  declarations: [EsriLegendComponent],
  imports: [CommonModule],
  exports: [EsriLegendComponent]
})
export class EsriLegendModule {}
