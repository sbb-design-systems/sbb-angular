import { ModuleWithProviders, NgModule } from '@angular/core';

import { SbbIconComponent } from './icon';
import { SBB_MODULE_ICONS_TOKEN, SBB_MODULE_ICON_REGISTRY_PROVIDER } from './module-icons';

@NgModule({
  declarations: [SbbIconComponent],
  exports: [SbbIconComponent],
})
export class SbbIconModule {
  /**
   * WARNING!
   * Internal usage only! Not intended for consumers!
   * @param icons The icons to register for the consuming module.
   * @docs-private
   */
  static ɵforInternalModule(icons: string[]): ModuleWithProviders {
    return {
      ngModule: SbbIconModule,
      providers: [
        { provide: SBB_MODULE_ICONS_TOKEN, useValue: icons },
        SBB_MODULE_ICON_REGISTRY_PROVIDER,
      ],
    };
  }
}
