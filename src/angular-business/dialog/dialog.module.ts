import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbDialogContainer } from './dialog-container/dialog-container.component';
import { SbbDialogContent } from './dialog-content/dialog-content.component';
import { SbbDialogFooter } from './dialog-footer/dialog-footer.component';
import { SbbDialogHeader } from './dialog-header/dialog-header.component';
import { SbbDialogClose } from './dialog/dialog-close.directive';
import { SbbDialog, SBB_DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog/dialog.service';

@NgModule({
  imports: [CommonModule, SbbIconModule, OverlayModule, PortalModule],
  exports: [SbbDialogContainer, SbbDialogClose, SbbDialogHeader, SbbDialogContent, SbbDialogFooter],
  declarations: [
    SbbDialogContainer,
    SbbDialogClose,
    SbbDialogHeader,
    SbbDialogFooter,
    SbbDialogContent,
  ],
  providers: [SbbDialog, SBB_DIALOG_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [SbbDialogContainer],
})
export class SbbDialogModule {}
