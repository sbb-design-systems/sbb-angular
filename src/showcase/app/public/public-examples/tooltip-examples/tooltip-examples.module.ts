import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPlusModule } from '@sbb-esta/angular-icons/navigation';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { TooltipModule } from '@sbb-esta/angular-public/tooltip';

import { TooltipExampleComponent } from './tooltip-example/tooltip-example.component';

const EXAMPLES = [TooltipExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconPlusModule,
    FieldModule,
    TooltipModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TooltipExamplesModule {}
