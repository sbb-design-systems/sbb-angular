import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';
import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';
import { IconInfoModule, IconCloseModule } from '../svg-icons/svg-icons';
import { GhettoboxIconDirective, GhettoboxLinkDirective } from './ghettobox/ghettobox-content.directives';

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
    IconCloseModule
  ],
  exports: [
    GhettoboxComponent,
    GhettoboxContainerComponent,
    GhettoboxIconDirective,
    GhettoboxLinkDirective
  ]
})
export class GhettoboxModule { }
