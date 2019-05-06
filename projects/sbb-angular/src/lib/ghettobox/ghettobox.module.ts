import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IconArrowRightModule,
  IconCrossModule,
  IconHimInfoModule
} from 'sbb-angular-icons';

import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { GhettoboxIconDirective } from './ghettobox/ghettobox-icon.directive';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';

@NgModule({
  declarations: [
    GhettoboxComponent,
    GhettoboxContainerComponent,
    GhettoboxIconDirective
  ],
  imports: [
    CommonModule,
    IconCrossModule,
    IconArrowRightModule,
    IconHimInfoModule,
    PortalModule,
    RouterModule
  ],
  exports: [
    GhettoboxComponent,
    GhettoboxContainerComponent,
    GhettoboxIconDirective
  ],
  entryComponents: [GhettoboxComponent]
})
export class GhettoboxModule {}
