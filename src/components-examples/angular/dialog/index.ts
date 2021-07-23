import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbDialogModule } from '@sbb-esta/angular/dialog';
import { SbbInputModule } from '@sbb-esta/angular/input';

import {
  ComponentDataDialogComponent,
  ComponentDataDialogExample,
} from './component-data-dialog/component-data-dialog-example';
import {
  SharedDataDialogComponent,
  SharedDataDialogExample,
} from './shared-data-dialog/shared-data-dialog-example';
import { TemplateDialogExample } from './template-dialog/template-dialog-example';

export {
  ComponentDataDialogComponent,
  ComponentDataDialogExample,
  SharedDataDialogComponent,
  SharedDataDialogExample,
  TemplateDialogExample,
};

const EXAMPLES = [
  ComponentDataDialogComponent,
  ComponentDataDialogExample,
  SharedDataDialogComponent,
  SharedDataDialogExample,
  TemplateDialogExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbDialogModule,
    SbbInputModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class DialogExamplesModule {}
