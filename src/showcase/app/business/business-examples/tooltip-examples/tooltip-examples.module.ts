import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { IconPlusModule } from '@sbb-esta/angular-icons/navigation';

import { TooltipCustomContentExampleComponent } from './tooltip-custom-content-example/tooltip-custom-content-example.component';
import { TooltipCustomIconExampleComponent } from './tooltip-custom-icon-example/tooltip-custom-icon-example.component';
import { TooltipHoverExampleComponent } from './tooltip-hover-example/tooltip-hover-example.component';
import { TooltipSimpleExampleComponent } from './tooltip-simple-example/tooltip-simple-example.component';

const EXAMPLES = [
  TooltipCustomContentExampleComponent,
  TooltipCustomIconExampleComponent,
  TooltipHoverExampleComponent,
  TooltipSimpleExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    TooltipModule,
    IconPlusModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TooltipExamplesModule {}
