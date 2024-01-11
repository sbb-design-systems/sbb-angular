import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { EsriPluginComponent } from './esri-plugin';

@NgModule({
  declarations: [EsriPluginComponent],
  imports: [CommonModule, HttpClientModule],
  providers: [HttpClient],
  exports: [EsriPluginComponent],
})
export class SbbEsriPluginModule {}
