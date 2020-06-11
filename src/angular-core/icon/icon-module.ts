import { ModuleWithProviders, NgModule } from '@angular/core';

import { SbbIconComponent } from './icon';
import { SBB_MODULE_ICONS, SBB_MODULE_ICON_REGISTRY_PROVIDER } from './icon-cdn-registry';

@NgModule({
  declarations: [SbbIconComponent],
  exports: [SbbIconComponent],
})
export class SbbIconModule {
  static forInternalModule(icons: string[]): ModuleWithProviders {
    return {
      ngModule: SbbIconModule,
      providers: [
        { provide: SBB_MODULE_ICONS, useValue: icons },
        SBB_MODULE_ICON_REGISTRY_PROVIDER,
      ],
    };
  }
}
