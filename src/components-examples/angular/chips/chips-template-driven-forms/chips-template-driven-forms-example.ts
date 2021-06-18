import { Component } from '@angular/core';

/**
 * @title Chips Template Driven Forms
 * @order 2
 */
@Component({
  selector: 'sbb-chips-template-driven-forms-example',
  templateUrl: 'chips-template-driven-forms-example.html',
})
export class ChipsTemplateDrivenFormsExample {
  model = new Set(['ICN', 'FLIRT', 'KISS']);
  disabled = false;

  get valuesArray() {
    return [...this.model.values()];
  }
}
