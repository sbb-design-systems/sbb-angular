import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';

import { CheckboxExampleComponent } from './checkbox-example/checkbox-example.component';

const EXAMPLES = [CheckboxExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CheckboxExamplesModule {}
