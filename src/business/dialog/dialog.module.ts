import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconCrossModule } from '@sbb-esta/angular-icons';

import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { DialogFooterComponent } from './dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';
import { DialogCloseDirective } from './dialog/dialog-close.directive';
import { Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog/dialog.service';

@NgModule({
  imports: [CommonModule, IconCrossModule, OverlayModule, PortalModule],
  exports: [
    DialogContainerComponent,
    DialogCloseDirective,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogFooterComponent
  ],
  declarations: [
    DialogContainerComponent,
    DialogCloseDirective,
    DialogHeaderComponent,
    DialogFooterComponent,
    DialogContentComponent
  ],
  providers: [Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [DialogContainerComponent]
})
export class DialogModule {}
