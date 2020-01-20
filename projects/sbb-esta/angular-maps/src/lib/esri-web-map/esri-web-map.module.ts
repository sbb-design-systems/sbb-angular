import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';

import { EsriTypesService } from './esri-types/esri-types.service';
import { EsriWebMapComponent } from './esri-web-map.component';

@NgModule({
  declarations: [EsriWebMapComponent],
  providers: [EsriTypesService],
  imports: [CommonModule, CoreModule],
  exports: [EsriWebMapComponent]
})
export class EsriWebMapModule {}
