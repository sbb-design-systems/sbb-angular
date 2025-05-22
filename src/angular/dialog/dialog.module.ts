import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbDialog } from './dialog';
import { SbbDialogContainer } from './dialog-container';
import {
  SbbDialogActions,
  SbbDialogClose,
  SbbDialogContent,
  SbbDialogTitle,
} from './dialog-content-directives';

@NgModule({
  imports: [
    DialogModule,
    OverlayModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
    SbbDialogContainer,
    SbbDialogClose,
    SbbDialogTitle,
    SbbDialogActions,
    SbbDialogContent,
  ],
  exports: [SbbDialogContainer, SbbDialogClose, SbbDialogTitle, SbbDialogContent, SbbDialogActions],
  providers: [SbbDialog],
})
export class SbbDialogModule {}
