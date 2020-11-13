import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbDialogModule } from '@sbb-esta/angular-business/dialog';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';

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
  'template-dialog-example': TemplateDialogExampleComponent,
  'shared-data-dialog-example': SharedDataDialogExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbDialogModule,
    SbbFormFieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'dialog', EXAMPLE_INDEX)],
})
export class DialogExamplesModule {}
