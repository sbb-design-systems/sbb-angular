import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbChipsModule } from '@sbb-esta/angular/chips';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

/**
 * @title Chips Template Driven Forms
 * @order 2
 */
@Component({
  selector: 'sbb-chips-template-driven-forms-example',
  templateUrl: 'chips-template-driven-forms-example.html',
  standalone: true,
  imports: [SbbFormFieldModule, SbbChipsModule, FormsModule, SbbButtonModule, JsonPipe],
})
export class ChipsTemplateDrivenFormsExample {
  model = new Set(['ICN', 'FLIRT', 'KISS']);
  disabled = false;

  get valuesArray() {
    return [...this.model.values()];
  }
}
