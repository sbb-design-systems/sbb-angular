import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { LightboxContainerComponent } from './lightbox/lightbox-container.component';
import {
  LightboxCloseDirective,
  LightboxContentComponent,
  LightboxFooterComponent,
  LightboxHeaderComponent,
  LightboxTitleDirective,
} from './lightbox/lightbox-content';
import { Lightbox, LIGHTBOX_SCROLL_STRATEGY_PROVIDER } from './lightbox/lightbox.service';

@NgModule({
  imports: [CommonModule, SbbIconModule, OverlayModule, PortalModule],
  exports: [
    LightboxContainerComponent,
    LightboxCloseDirective,
    LightboxHeaderComponent,
    LightboxContentComponent,
    LightboxFooterComponent,
    LightboxTitleDirective,
  ],
  declarations: [
    LightboxContainerComponent,
    LightboxCloseDirective,
    LightboxHeaderComponent,
    LightboxFooterComponent,
    LightboxContentComponent,
    LightboxTitleDirective,
  ],
  providers: [Lightbox, LIGHTBOX_SCROLL_STRATEGY_PROVIDER],
  entryComponents: [LightboxContainerComponent],
})
export class LightboxModule {}
