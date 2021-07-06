import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbDialog, SBB_DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog';
import { SbbDialogContainer } from './dialog-container';
import {
  SbbDialogActions,
  SbbDialogClose,
  SbbDialogContent,
  SbbDialogTitle,
} from './dialog-content-directives';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, SbbIconModule],
  exports: [SbbDialogContainer, SbbDialogClose, SbbDialogTitle, SbbDialogContent, SbbDialogActions],
  declarations: [
    SbbDialogContainer,
    SbbDialogClose,
    SbbDialogTitle,
    SbbDialogActions,
    SbbDialogContent,
  ],
  providers: [SbbDialog, SBB_DIALOG_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [SbbDialogContainer],
})
export class SbbDialogModule {}
