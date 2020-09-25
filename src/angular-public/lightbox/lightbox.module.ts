import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbLightboxContainer } from './lightbox/lightbox-container.component';
import {
  SbbLightboxClose,
  SbbLightboxContent,
  SbbLightboxFooter,
  SbbLightboxHeader,
  SbbLightboxTitle,
} from './lightbox/lightbox-content';
import { SbbLightbox, SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER } from './lightbox/lightbox.service';

@NgModule({
  imports: [CommonModule, SbbIconModule, OverlayModule, PortalModule],
  exports: [
    SbbLightboxContainer,
    SbbLightboxClose,
    SbbLightboxHeader,
    SbbLightboxContent,
    SbbLightboxFooter,
    SbbLightboxTitle,
  ],
  declarations: [
    SbbLightboxContainer,
    SbbLightboxClose,
    SbbLightboxHeader,
    SbbLightboxFooter,
    SbbLightboxContent,
    SbbLightboxTitle,
  ],
  providers: [SbbLightbox, SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [SbbLightboxContainer],
})
export class SbbLightboxModule {}
