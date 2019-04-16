import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';
import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { IconCrossModule, IconArrowRightModule, IconHimInfoModule } from 'sbb-angular-icons';
import { GhettoboxIconDirective } from './ghettobox/ghettobox-icon.directive';
import { PortalModule } from '@angular/cdk/portal';
import { RouterModule } from '@angular/router';

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
  entryComponents: [
    GhettoboxComponent
  ]
})
export class GhettoboxModule { }
