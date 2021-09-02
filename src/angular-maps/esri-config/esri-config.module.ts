import { ModuleWithProviders, NgModule } from '@angular/core';

import { SbbEsriConfigConsts } from '../esri-config/esri-standard-values.const';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriLoaderService } from './esri-loader.service';

@NgModule({})
export class SbbEsriConfigModule {
  static forRoot(config?: SbbEsriConfiguration): ModuleWithProviders<SbbEsriConfigModule> {
    return {
      ngModule: SbbEsriConfigModule,
      providers: [
        {
          provide: SbbEsriLoaderService,
          useValue: new SbbEsriLoaderService(config ?? SbbEsriConfigConsts),
        },
      ],
    };
  }
}
