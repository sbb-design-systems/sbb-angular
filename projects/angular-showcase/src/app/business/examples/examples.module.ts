import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AutocompleteModule,
  CheckboxModule,
  ClearInputModule,
  DatepickerModule,
  FieldModule
} from '@sbb-esta/angular-business';
import { SearchModule } from '@sbb-esta/angular-public';

import { ClearInputShowcaseComponent } from './clear-input-showcase/clear-input-showcase.component';

const exampleComponents = [ClearInputShowcaseComponent];
@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClearInputModule,
    AutocompleteModule,
    DatepickerModule,
    FieldModule,
    CheckboxModule,
    SearchModule
  ]
})
export class ExamplesModule {}
