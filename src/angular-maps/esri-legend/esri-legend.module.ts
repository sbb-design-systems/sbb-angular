import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbEsriLegend } from './esri-legend/esri-legend.component';

@NgModule({
  declarations: [SbbEsriLegend],
  imports: [CommonModule],
  exports: [SbbEsriLegend],
})
export class SbbEsriLegendModule {}
