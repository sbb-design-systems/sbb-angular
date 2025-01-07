import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbSelectModule } from '@sbb-esta/angular/select';

/**
 * @title Select with selectable null options
 * @order 70
 */
@Component({
  selector: 'sbb-select-selectable-null-example',
  templateUrl: 'select-selectable-null-example.html',
  imports: [FormsModule, SbbFormFieldModule, SbbSelectModule],
})
export class SelectSelectableNullExample {
  value: number | null = null;

  options = [
    { label: 'None', value: null },
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
  ];
}
