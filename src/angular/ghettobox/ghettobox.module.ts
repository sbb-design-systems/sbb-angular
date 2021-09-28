import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbGhettobox } from './ghettobox';
import { SbbGhettoboxOutlet } from './ghettobox-outlet';

@NgModule({
  declarations: [SbbGhettobox, SbbGhettoboxOutlet],
  imports: [CommonModule, RouterModule, SbbIconModule],
  exports: [SbbGhettobox, SbbGhettoboxOutlet],
  entryComponents: [SbbGhettobox],
})
export class SbbGhettoboxModule {}
