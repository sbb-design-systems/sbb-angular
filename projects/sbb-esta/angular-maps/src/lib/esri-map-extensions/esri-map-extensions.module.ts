import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriBasemapGalleryModule } from './esri-basemap-gallery/esri-basemap-gallery.module';
import { EsriLayerListModule } from './esri-layer-list/esri-layer-list.module';
import { EsriLegendModule } from './esri-legend/esri-legend.module';
import { EsriTypesService } from './esri-types/esri-types.service';
@NgModule({
  declarations: [],
  providers: [EsriTypesService],
  imports: [CommonModule],
  exports: [EsriLegendModule, EsriLayerListModule, EsriBasemapGalleryModule]
})
export class EsriMapExtensionsModule {}
