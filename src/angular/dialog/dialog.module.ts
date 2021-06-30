import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';

import { SbbDialog, SBB_DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog';
import { SbbDialogContainer } from './dialog-container';
import {
  SbbDialogActions,
  SbbDialogClose,
  SbbDialogContent,
  SbbDialogTitle,
} from './dialog-content-directives';

@NgModule({
  imports: [OverlayModule, PortalModule],
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
