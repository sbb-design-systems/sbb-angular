import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriBasemapGalleryComponent } from './esri-basemap-gallery/esri-basemap-gallery.component';

@NgModule({
  declarations: [EsriBasemapGalleryComponent],
  imports: [CommonModule],
  exports: [EsriBasemapGalleryComponent]
})
export class EsriBasemapGalleryModule {}
