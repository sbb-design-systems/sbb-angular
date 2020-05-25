import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';

import { CheckboxExampleComponent } from './checkbox-example/checkbox-example.component';
import { CheckboxGroupExampleComponent } from './checkbox-group-example/checkbox-group-example.component';

const EXAMPLES = [CheckboxExampleComponent, CheckboxGroupExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CheckboxExamplesModule {}
