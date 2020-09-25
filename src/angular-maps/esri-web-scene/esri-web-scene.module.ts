import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbEsriWebScene } from './esri-web-scene/esri-web-scene.component';

@NgModule({
  declarations: [SbbEsriWebScene],
  imports: [CommonModule],
  exports: [SbbEsriWebScene],
})
export class SbbEsriWebSceneModule {}
