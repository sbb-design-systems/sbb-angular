import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbDialogModule } from '@sbb-esta/angular/dialog';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbLightbox, SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER } from './lightbox';
import { SbbLightboxContainer } from './lightbox-container';
import {
  SbbLightboxActions,
  SbbLightboxClose,
  SbbLightboxContent,
  SbbLightboxTitle,
} from './lightbox-content-directives';

@NgModule({
  imports: [
    DialogModule,
    // To avoid injector problems of CDK Dialog. TODO: Check if it is still necessary (has to be done in a consumer project).
    SbbDialogModule,
    OverlayModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
  ],
  exports: [
    SbbLightboxContainer,
    SbbLightboxClose,
    SbbLightboxTitle,
    SbbLightboxContent,
    SbbLightboxActions,
  ],
  declarations: [
    SbbLightboxContainer,
    SbbLightboxClose,
    SbbLightboxTitle,
    SbbLightboxActions,
    SbbLightboxContent,
  ],
  providers: [SbbLightbox, SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER],
})
export class SbbLightboxModule {}
