import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { IconArrowsRightLeftModule } from '@sbb-esta/angular-icons/arrow';
import { DatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { ToggleModule } from '@sbb-esta/angular-public/toggle';

import { ToggleExampleComponent } from './toggle-example/toggle-example.component';

const EXAMPLES = [ToggleExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconArrowRightModule,
    IconArrowsRightLeftModule,
    DatepickerModule,
    FieldModule,
    ToggleModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class ToggleExamplesModule {}
