import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAppChooserSection } from './app-chooser-section';
import { SbbHeaderLean } from './header';
import { SbbHeaderEnvironment, SbbHeaderIconActions } from './header-directives';
import { SbbHeaderMenu } from './header-menu';
import { SbbHeaderMenuItem } from './header-menu-item';
import {
  SbbHeaderMenuTrigger,
  SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './header-menu-trigger';

@NgModule({
  imports: [
    ObserversModule,
    OverlayModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
    SbbHeaderLean,
    SbbAppChooserSection,
    SbbHeaderEnvironment,
    SbbHeaderIconActions,
    SbbHeaderMenuItem,
    SbbHeaderMenuTrigger,
    SbbHeaderMenu,
  ],
  exports: [
    SbbHeaderLean,
    SbbAppChooserSection,
    SbbHeaderEnvironment,
    SbbHeaderIconActions,
    SbbHeaderMenuItem,
    SbbHeaderMenuTrigger,
    SbbHeaderMenu,
  ],
  providers: [SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbHeaderLeanModule {}
