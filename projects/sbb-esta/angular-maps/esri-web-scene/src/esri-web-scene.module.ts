import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriWebSceneComponent } from './esri-web-scene/esri-web-scene.component';

@NgModule({
  declarations: [EsriWebSceneComponent],
  imports: [CommonModule],
  exports: [EsriWebSceneComponent]
})
export class EsriWebSceneModule {}
