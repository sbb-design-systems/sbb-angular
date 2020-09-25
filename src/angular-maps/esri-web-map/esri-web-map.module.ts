import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbEsriWebMap } from './esri-web-map/esri-web-map.component';

@NgModule({
  declarations: [SbbEsriWebMap],
  providers: [],
  imports: [CommonModule],
  exports: [SbbEsriWebMap],
})
export class SbbEsriWebMapModule {}
