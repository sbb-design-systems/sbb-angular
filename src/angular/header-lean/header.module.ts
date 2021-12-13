import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAppChooserSection } from './app-chooser-section';
import { SbbHeaderLean } from './header';
import { SbbHeaderEnvironment } from './header-directives';
import { SbbHeaderMenu } from './header-menu';
import { SbbHeaderMenuItem } from './header-menu-item';
import {
  SbbHeaderMenuTrigger,
  SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './header-menu-trigger';

@NgModule({
  imports: [
    CommonModule,
    ObserversModule,
    OverlayModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
  ],
  declarations: [
    SbbHeaderLean,
    SbbAppChooserSection,
    SbbHeaderEnvironment,
    SbbHeaderMenuItem,
    SbbHeaderMenuTrigger,
    SbbHeaderMenu,
  ],
  exports: [
    SbbHeaderLean,
    SbbAppChooserSection,
    SbbHeaderEnvironment,
    SbbHeaderMenuItem,
    SbbHeaderMenuTrigger,
    SbbHeaderMenu,
  ],
  providers: [SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbHeaderLeanModule {}
