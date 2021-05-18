import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbGhettoboxContainer } from './ghettobox-container/ghettobox-container.component';
import { SbbGhettobox } from './ghettobox/ghettobox.component';

@NgModule({
  declarations: [SbbGhettobox, SbbGhettoboxContainer],
  imports: [CommonModule, SbbIconDirectiveModule, PortalModule, RouterModule, SbbIconModule],
  exports: [SbbGhettobox, SbbGhettoboxContainer, SbbIconDirectiveModule],
  entryComponents: [SbbGhettobox],
})
export class SbbGhettoboxModule {}
