import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';
import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { IconCloseModule, IconArrowDownModule, IconHimInfoModule } from '../svg-icons/svg-icons';
import { GhettoboxIconDirective } from './ghettobox/ghettobox-icon.directive';
import { PortalModule } from '@angular/cdk/portal';
import { RouterModule } from '@angular/router';
import { GhettoboxContainerService } from './ghettobox-container/ghettobox-container.service';

@NgModule({
  declarations: [
    GhettoboxComponent,
    GhettoboxContainerComponent,
    GhettoboxIconDirective
  ],
  imports: [
    CommonModule,
    IconCloseModule,
    IconArrowDownModule,
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
