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
import { ChipsInputCustomHandlerExample } from './chips-input-custom-handler/chips-input-custom-handler-example';
import { ChipsReactiveFormsExample } from './chips-reactive-forms/chips-reactive-forms-example';
import { ChipsTemplateDrivenFormsExample } from './chips-template-driven-forms/chips-template-driven-forms-example';

export {
  ChipsAutocompleteExample,
  ChipsDragDropExample,
  ChipsInputCustomHandlerExample,
  ChipsReactiveFormsExample,
  ChipsTemplateDrivenFormsExample,
};

const EXAMPLES = [
  ChipsAutocompleteExample,
  ChipsDragDropExample,
  ChipsInputCustomHandlerExample,
  ChipsReactiveFormsExample,
  ChipsTemplateDrivenFormsExample,
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
