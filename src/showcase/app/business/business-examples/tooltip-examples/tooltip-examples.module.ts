import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { IconPlusModule } from '@sbb-esta/angular-icons/navigation';

import { TooltipExampleComponent } from './tooltip-example/tooltip-example.component';

const EXAMPLES = [TooltipExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    TooltipModule,
    IconPlusModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TooltipExamplesModule {}
