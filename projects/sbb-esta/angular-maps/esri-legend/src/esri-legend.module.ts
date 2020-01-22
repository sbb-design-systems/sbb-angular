import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriLegendComponent } from './esri-legend/esri-legend.component';
import { EsriTypesService } from './esri-types/esri-types.service';

@NgModule({
  declarations: [EsriLegendComponent],
  providers: [EsriTypesService],
  imports: [CommonModule],
  exports: [EsriLegendComponent]
})
export class EsriLegendModule {}
