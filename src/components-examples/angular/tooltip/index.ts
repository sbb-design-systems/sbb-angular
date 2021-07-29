import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

import { TooltipCustomContentExample } from './tooltip-custom-content/tooltip-custom-content-example';
import { TooltipCustomIconExample } from './tooltip-custom-icon/tooltip-custom-icon-example';
import { TooltipHoverExample } from './tooltip-hover/tooltip-hover-example';
import { TooltipSimpleExample } from './tooltip-simple/tooltip-simple-example';

export {
  TooltipCustomContentExample,
  TooltipCustomIconExample,
  TooltipHoverExample,
  TooltipSimpleExample,
};

const EXAMPLES = [
  TooltipCustomContentExample,
  TooltipCustomIconExample,
  TooltipHoverExample,
  TooltipSimpleExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbButtonModule,
    SbbInputModule,
    SbbTooltipModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TooltipExamplesModule {}
