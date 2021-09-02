import { ModuleWithProviders, NgModule } from '@angular/core';

import { SbbEsriConfiguration } from './esri-configuration';
import { SbbEsriLoaderService } from './esri-loader.service';
import { SbbEsriConfigConsts } from './esri-standard-values.const';

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
