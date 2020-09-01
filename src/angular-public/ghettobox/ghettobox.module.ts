import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';

@NgModule({
  declarations: [GhettoboxComponent, GhettoboxContainerComponent],
  imports: [CommonModule, IconDirectiveModule, PortalModule, RouterModule, SbbIconModule],
  exports: [GhettoboxComponent, GhettoboxContainerComponent, IconDirectiveModule],
  entryComponents: [GhettoboxComponent],
})
export class GhettoboxModule {}
