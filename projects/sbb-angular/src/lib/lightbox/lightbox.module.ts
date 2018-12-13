import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatDialog } from './lightbox/dialog';
import { MatDialogContainer } from './lightbox/dialog-container';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from './lightbox/dialog-content-directives';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  exports: [
    MatDialogContainer,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  declarations: [
    MatDialogContainer,
    MatDialogClose,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
  ],
  providers: [
    MatDialog
  ],
  entryComponents: [
    MatDialogContainer
  ]
})
export class LightboxModule { }
