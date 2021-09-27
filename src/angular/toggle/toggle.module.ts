import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbToggle } from './toggle';
import {
  SbbToggleDetails,
  SbbToggleIcon,
  SbbToggleLabel,
  SbbToggleSubtitle,
} from './toggle-directives';
import { SbbToggleOption } from './toggle-option';

@NgModule({
  declarations: [
    SbbToggle,
    SbbToggleOption,
    SbbToggleIcon,
    SbbToggleLabel,
    SbbToggleSubtitle,
    SbbToggleDetails,
  ],
  imports: [CommonModule, PortalModule, SbbIconModule],
  exports: [
    SbbToggle,
    SbbToggleOption,
    SbbToggleIcon,
    SbbToggleLabel,
    SbbToggleSubtitle,
    SbbToggleDetails,
  ],
})
export class SbbToggleModule {}
