import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';
import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { IconInfoModule, IconCloseModule } from '../svg-icons/svg-icons';
import { GhettoboxIconDirective, GhettoboxLinkDirective } from './ghettobox/ghettobox-content.directives';
import { PortalModule } from '@angular/cdk/portal';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GhettoboxComponent,
    GhettoboxContainerComponent,
    GhettoboxIconDirective,
    GhettoboxLinkDirective
  ],
  imports: [
    CommonModule,
    IconInfoModule,
    IconCloseModule,
    PortalModule,
    RouterModule
  ],
  exports: [
    GhettoboxComponent,
    GhettoboxContainerComponent,
    GhettoboxIconDirective,
    GhettoboxLinkDirective
  ],
  entryComponents: [
    GhettoboxComponent
  ]
})
export class GhettoboxModule { }
