import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { IconCrossModule } from '@sbb-esta/angular-icons';

import { DialogCloseDirective } from './dialog/dialog-close.directive';
import { DialogContainerComponent } from './dialog/dialog-container.component';
import { DialogContentComponent } from './dialog/dialog-content.component';
import { DialogFooterComponent } from './dialog/dialog-footer.component';
import { DialogHeaderComponent } from './dialog/dialog-header.component';
import { DialogTitleDirective } from './dialog/dialog-title.directive';
import { DialogComponent } from './dialog/dialog.component';
import { Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog/dialog.service';

@NgModule({
  imports: [CommonModule, IconCrossModule, OverlayModule, PortalModule, ScrollingModule],
  exports: [
    DialogContainerComponent,
    DialogComponent,
    DialogCloseDirective,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogFooterComponent,
    DialogTitleDirective
  ],
  declarations: [
    DialogContainerComponent,
    DialogComponent,
    DialogCloseDirective,
    DialogHeaderComponent,
    DialogFooterComponent,
    DialogContentComponent,
    DialogTitleDirective
  ],
  providers: [Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [DialogContainerComponent]
})
export class DialogModule {}
