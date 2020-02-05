import { ModuleWithProviders, NgModule } from '@angular/core';

import { ESRI_CONFIG_TOKEN } from './esri-config.token';
import { EsriConfiguration } from './esri-configuration';

@NgModule({
  declarations: [],
  imports: []
})
export class EsriConfigModule {
  static forRoot(config: EsriConfiguration): ModuleWithProviders {
    return {
      ngModule: EsriConfigModule,
      providers: [
        {
          provide: ESRI_CONFIG_TOKEN,
          useValue: config
        }
      ]
    };
  }
}
