import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ButtonModule } from '../button/button.module';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { LightboxModule } from '../lightbox/lightbox.module';


@NgModule({
  declarations: [TooltipComponent],
  imports: [
    CommonModule, ButtonModule, IconCommonModule,LightboxModule
  ],
  exports:[TooltipComponent]
})
export class TooltipModule { }
