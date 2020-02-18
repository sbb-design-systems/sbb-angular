import { ModuleWithProviders, NgModule } from '@angular/core';

import { ESRI_CONFIG_TOKEN } from './esri-config.token';
import { EsriConfiguration } from './esri-configuration';

@NgModule({})
export class EsriConfigModule {
  static forRoot(config: EsriConfiguration): ModuleWithProviders<EsriConfigModule> {
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
