import { Component } from '@angular/core';

/**
 * @title Select Template Driven Forms
 * @order 20
 */
@Component({
  selector: 'sbb-select-forms-example',
  templateUrl: './select-forms-example.html',
})
export class SelectFormsExample {
  value: string;
  disabled: boolean = false;
  optionDisabled: boolean = false;
}
