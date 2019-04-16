import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { Lightbox, LIGHTBOX_SCROLL_STRATEGY_PROVIDER } from './lightbox/lightbox.service';
import { LightboxContainerComponent } from './lightbox/lightbox-container.component';
import {
  LightboxFooterComponent,
  LightboxCloseDirective,
  LightboxContentComponent,
  LightboxHeaderComponent,
  LightboxTitleDirective,
} from './lightbox/lightbox-content';
import { IconCrossModule } from 'sbb-angular-icons';


@NgModule({
  imports: [
    CommonModule,
    IconCrossModule,
    OverlayModule,
    PortalModule,
    PerfectScrollbarModule
  ],
  exports: [
    LightboxContainerComponent,
    LightboxCloseDirective,
    LightboxHeaderComponent,
    LightboxContentComponent,
    LightboxFooterComponent,
    LightboxTitleDirective
  ],
  declarations: [
    LightboxContainerComponent,
    LightboxCloseDirective,
    LightboxHeaderComponent,
    LightboxFooterComponent,
    LightboxContentComponent,
    LightboxTitleDirective
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
