import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbChipsModule } from '@sbb-esta/angular/chips';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { ChipsAutocompleteExample } from './chips-autocomplete/chips-autocomplete-example';
import { ChipsDragDropExample } from './chips-drag-drop/chips-drag-drop-example';
import { ChipsFormControlExample } from './chips-form-control/chips-form-control-example';
import { ChipsInputExample } from './chips-input/chips-input-example';
import { ChipsOverviewExample } from './chips-overview/chips-overview-example';
import { ChipsReactiveFormsExample } from './chips-reactive-forms/chips-reactive-forms-example';

export {
  ChipsAutocompleteExample,
  ChipsDragDropExample,
  ChipsInputExample,
  ChipsOverviewExample,
  ChipsReactiveFormsExample,
  ChipsFormControlExample,
};

const EXAMPLES = [
  ChipsAutocompleteExample,
  ChipsDragDropExample,
  ChipsInputExample,
  ChipsOverviewExample,
  ChipsReactiveFormsExample,
  ChipsFormControlExample,
];

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    SbbAutocompleteModule,
    SbbButtonModule,
    SbbChipsModule,
    SbbIconModule,
    SbbFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES,
})
export class ChipsExamplesModule {}
