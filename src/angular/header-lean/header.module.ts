import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAppChooserSection } from './app-chooser-section';
import { SbbHeaderLean } from './header';
import { SbbHeaderEnvironment } from './header-directives';

@NgModule({
  imports: [CommonModule, ObserversModule, PortalModule, SbbIconModule],
  declarations: [SbbHeaderLean, SbbAppChooserSection, SbbHeaderEnvironment],
  exports: [SbbHeaderLean, SbbAppChooserSection, SbbHeaderEnvironment],
})
export class SbbHeaderLeanModule {}
