import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPlusModule } from '@sbb-esta/angular-icons/navigation';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { LinksModule } from '@sbb-esta/angular-public/links';
import { TooltipModule } from '@sbb-esta/angular-public/tooltip';

import { TooltipCustomContentExampleComponent } from './tooltip-custom-content-example/tooltip-custom-content-example.component';
import { TooltipCustomIconExampleComponent } from './tooltip-custom-icon-example/tooltip-custom-icon-example.component';
import { TooltipSimpleExampleComponent } from './tooltip-simple-example/tooltip-simple-example.component';

const EXAMPLES = [
  TooltipCustomContentExampleComponent,
  TooltipCustomIconExampleComponent,
  TooltipSimpleExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconPlusModule,
    ButtonModule,
    FieldModule,
    LinksModule,
    TooltipModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TooltipExamplesModule {}
