import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbChipsModule } from '@sbb-esta/angular/chips';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

/**
 * @title Chips Reactive Forms
 * @order 1
 */
@Component({
  selector: 'sbb-chips-reactive-forms-example',
  templateUrl: 'chips-reactive-forms-example.html',
  standalone: true,
  imports: [
    SbbFormFieldModule,
    SbbChipsModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    JsonPipe,
  ],
})
export class ChipsReactiveFormsExample {
  formControl = new FormControl(new Set(['Re420', 'Re460']));

  get valuesArray() {
    return [...this.formControl.value!];
  }
}
