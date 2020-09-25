import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbEsriBasemapGallery } from './esri-basemap-gallery/esri-basemap-gallery.component';

@NgModule({
  declarations: [SbbEsriBasemapGallery],
  imports: [CommonModule],
  exports: [SbbEsriBasemapGallery],
})
export class SbbEsriBasemapGalleryModule {}
