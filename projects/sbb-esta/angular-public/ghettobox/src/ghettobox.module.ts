import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { IconArrowRightModule, IconCrossModule, IconHimInfoModule } from '@sbb-esta/angular-icons';

import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';

@NgModule({
  declarations: [GhettoboxComponent, GhettoboxContainerComponent],
  imports: [
    CommonModule,
    IconDirectiveModule,
    IconCrossModule,
    IconArrowRightModule,
    IconHimInfoModule,
    PortalModule,
    RouterModule
  ],
  exports: [GhettoboxComponent, GhettoboxContainerComponent, IconDirectiveModule],
  entryComponents: [GhettoboxComponent]
})
export class GhettoboxModule {}
