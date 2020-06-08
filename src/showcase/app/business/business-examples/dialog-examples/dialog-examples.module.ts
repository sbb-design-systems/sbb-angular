import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { FieldModule } from '@sbb-esta/angular-business/field';

import { provideExamples } from '../../../shared/example-provider';

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
  ComponentDataDialogComponent,
  ComponentDataDialogExampleComponent,
  SharedDataDialogComponent,
  SharedDataDialogExampleComponent,
  TemplateDialogExampleComponent,
];

const EXAMPLE_INDEX = {
  'component-data-dialog-example': ComponentDataDialogExampleComponent,
  'shared-data-dialog-example': SharedDataDialogExampleComponent,
  'template-dialog-example': TemplateDialogExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'dialog', EXAMPLE_INDEX)],
})
export class DialogExamplesModule {}
