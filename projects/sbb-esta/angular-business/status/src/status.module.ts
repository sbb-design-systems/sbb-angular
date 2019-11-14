import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { StatusTooltipComponent } from './status/status-tooltip/status-tooltip.component';
import { StatusTooltipDirective } from './status/status-tooltip/status-tooltip.directive';
import { StatusComponent } from './status/status.component';

@NgModule({
  imports: [
    CommonModule,
    IconCollectionModule,
    OverlayModule,
    BrowserAnimationsModule,
    BrowserModule
  ],
  declarations: [StatusComponent, StatusTooltipDirective, StatusTooltipComponent],
  exports: [StatusComponent, StatusTooltipComponent, StatusTooltipDirective],
  entryComponents: [StatusTooltipComponent]
})
export class StatusModule {}
