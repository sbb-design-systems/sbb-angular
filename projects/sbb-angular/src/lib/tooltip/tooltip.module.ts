import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip/tooltip.component';
import { ButtonModule } from '../button/button.module';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { IconExampleComponent } from './icon-example/icon-example.component';


@NgModule({
  declarations: [TooltipComponent, IconExampleComponent],
  imports: [
    CommonModule, ButtonModule, IconCommonModule
  ],
  exports:[TooltipComponent,IconExampleComponent]
})
export class TooltipModule { }
