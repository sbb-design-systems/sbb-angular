import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { EsriPluginComponent } from './esri-plugin';
import { FeatureLayerService } from './services/feature-layer.service';
import { SymbolParserService } from './services/symbol-parser.service';
import { UtilService } from './services/util.service';

@NgModule({
  declarations: [EsriPluginComponent],
  imports: [CommonModule, HttpClientModule],
  providers: [FeatureLayerService, SymbolParserService, UtilService, HttpClient],
  exports: [EsriPluginComponent],
})
export class SbbEsriPluginModule {}
