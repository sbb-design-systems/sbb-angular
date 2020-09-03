import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [CheckboxPanelComponent],
  exports: [CheckboxPanelComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class CheckboxPanelModule {}
