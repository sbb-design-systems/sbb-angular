import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular/icon';

import { SbbFileSelector } from './file-selector';

@NgModule({
  declarations: [SbbFileSelector],
  imports: [CommonModule, SbbIconModule],
  exports: [SbbFileSelector],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbFileSelectorModule {}
