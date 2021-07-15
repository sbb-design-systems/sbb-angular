import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
  imports: [CommonModule, OverlayModule, PortalModule, SbbIconModule],
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
  entryComponents: [SbbLightboxContainer],
})
export class SbbLightboxModule {}
