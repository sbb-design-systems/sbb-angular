import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriBasemapGalleryComponent } from './esri-basemap-gallery/esri-basemap-gallery.component';
import { EsriTypesService } from './esri-types/esri-types.service';

@NgModule({
  declarations: [EsriBasemapGalleryComponent],
  imports: [CommonModule],
  providers: [EsriTypesService],
  exports: [EsriBasemapGalleryComponent]
})
export class EsriBasemapGalleryModule {}
