import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { IconCrossModule } from '@sbb-esta/angular-icons';

import { DialogContainerComponent } from './dialog/dialog-container.component';
import {
  DialogCloseDirective,
  DialogComponent,
  DialogContentComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleDirective
} from './dialog/dialog-content';
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
    DialogComponent,
    DialogHeaderComponent,
    DialogFooterComponent,
    DialogContentComponent,
    DialogTitleDirective
  ],
  providers: [Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [DialogContainerComponent]
})
export class DialogModule {}
