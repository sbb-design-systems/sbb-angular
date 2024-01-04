import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriPluginComponent } from './esri-plugin';

@NgModule({
  declarations: [EsriPluginComponent],
  imports: [CommonModule],
  exports: [EsriPluginComponent],
})
export class SbbEsriPluginModule {}
