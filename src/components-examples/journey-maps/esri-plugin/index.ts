import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EsriPluginExample } from './esri-plugin/esri-plugin-example';

export { EsriPluginExample };
const EXAMPLES = [EsriPluginExample];

@NgModule({
  imports: [CommonModule, EXAMPLES],
  exports: [EXAMPLES],
})
export class EsriPluginExamplesModule {}
