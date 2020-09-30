import { ModuleWithProviders, NgModule } from '@angular/core';

import { SBB_ESRI_CONFIG_TOKEN } from './esri-config.token';
import { SbbEsriConfiguration } from './esri-configuration';

@NgModule({})
export class SbbEsriConfigModule {
  static forRoot(config: SbbEsriConfiguration): ModuleWithProviders<SbbEsriConfigModule> {
    return {
      ngModule: SbbEsriConfigModule,
      providers: [
        {
          provide: SBB_ESRI_CONFIG_TOKEN,
          useValue: config,
        },
      ],
    };
  }
}
