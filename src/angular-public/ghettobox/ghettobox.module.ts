import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { IconHimInfoModule } from '@sbb-esta/angular-icons/him-cus';
import { IconCrossModule } from '@sbb-esta/angular-icons/navigation';

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
    RouterModule,
  ],
  exports: [GhettoboxComponent, GhettoboxContainerComponent, IconDirectiveModule],
  entryComponents: [GhettoboxComponent],
})
export class GhettoboxModule {}
