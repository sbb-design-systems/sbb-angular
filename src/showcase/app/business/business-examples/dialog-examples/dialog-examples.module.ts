import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { FieldModule } from '@sbb-esta/angular-business/field';

import {
  DialogExampleComponent,
  DialogExampleExample2Component,
  DialogExampleExample2ContentComponent,
  DialogExampleExample3Component,
  DialogExampleExampleComponent,
  DialogExampleExampleContentComponent
} from './dialog-example/dialog-example.component';

const EXAMPLES = [
  DialogExampleComponent,
  DialogExampleExample2Component,
  DialogExampleExample2ContentComponent,
  DialogExampleExample3Component,
  DialogExampleExampleComponent,
  DialogExampleExampleContentComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, FieldModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class DialogExamplesModule {}
