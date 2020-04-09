import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { SelectModule } from '@sbb-esta/angular-business/select';

import { SelectFormsComponent } from './select-forms/select-forms.component';
import { SelectMultiSelectionComponent } from './select-multi-selection/select-multi-selection.component';
import { SelectNativeComponent } from './select-native/select-native.component';
import { SelectOptionGroupsMultiSelectionComponent } from './select-option-groups-multi-selection/select-option-groups-multi-selection.component';
import { SelectOptionGroupsComponent } from './select-option-groups/select-option-groups.component';
import { SelectReactiveFormsComponent } from './select-reactive-forms/select-reactive-forms.component';

const EXAMPLES = [
  SelectFormsComponent,
  SelectMultiSelectionComponent,
  SelectNativeComponent,
  SelectOptionGroupsMultiSelectionComponent,
  SelectOptionGroupsComponent,
  SelectReactiveFormsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    FieldModule,
    SelectModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class SelectExamplesModule {}
