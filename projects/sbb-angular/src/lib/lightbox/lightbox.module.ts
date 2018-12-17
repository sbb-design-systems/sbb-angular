import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { Lightbox, LIGHTBOX_SCROLL_STRATEGY_PROVIDER } from './lightbox/lightbox.service';
import { LightboxContainerComponent } from './lightbox/lightbox-container.component';
import {
  LightboxFooterDirective,
  LightboxCloseDirective,
  LightboxContentDirective,
  LightboxTitleDirective,
} from './lightbox/lightbox-content.directives';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  exports: [
    LightboxContainerComponent,
    LightboxCloseDirective,
    LightboxTitleDirective,
    LightboxContentDirective,
    LightboxFooterDirective,
  ],
  declarations: [
    LightboxContainerComponent,
    LightboxCloseDirective,
    LightboxTitleDirective,
    LightboxFooterDirective,
    LightboxContentDirective,
  ],
  providers: [
    Lightbox,
    LIGHTBOX_SCROLL_STRATEGY_PROVIDER
  ],
  entryComponents: [
    LightboxContainerComponent
  ]
})
export class LightboxModule { }
