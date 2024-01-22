import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
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
  imports: [PortalModule, SbbCommonModule, SbbIconModule],
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
