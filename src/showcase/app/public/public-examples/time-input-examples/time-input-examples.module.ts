import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeInputModule } from '@sbb-esta/angular-public/time-input';

import { TimeInputExampleComponent } from './time-input-example/time-input-example.component';

const EXAMPLES = [TimeInputExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TimeInputModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TimeInputExamplesModule {}
