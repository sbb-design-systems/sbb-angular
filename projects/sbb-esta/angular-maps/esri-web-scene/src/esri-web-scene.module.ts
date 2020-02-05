import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriTypesService } from './esri-types/esri-types.service';
import { EsriWebSceneComponent } from './esri-web-scene/esri-web-scene.component';

@NgModule({
  declarations: [EsriWebSceneComponent],
  providers: [EsriTypesService],
  imports: [CommonModule],
  exports: [EsriWebSceneComponent]
})
export class EsriWebSceneModule {}
