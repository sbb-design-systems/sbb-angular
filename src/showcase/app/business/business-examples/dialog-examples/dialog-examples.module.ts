import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { FieldModule } from '@sbb-esta/angular-business/field';

import {
  ComponentDataDialogComponent,
  ComponentDataDialogExampleComponent,
} from './component-data-dialog-example/component-data-dialog-example.component';
import {
  SharedDataDialogComponent,
  SharedDataDialogExampleComponent,
} from './shared-data-dialog-example/shared-data-dialog-example.component';
import { TemplateDialogExampleComponent } from './template-dialog-example/template-dialog-example.component';

const EXAMPLES = [
  TemplateDialogExampleComponent,
  ComponentDataDialogExampleComponent,
  SharedDataDialogExampleComponent,
  ComponentDataDialogComponent,
  SharedDataDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    FieldModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class DialogExamplesModule {}
