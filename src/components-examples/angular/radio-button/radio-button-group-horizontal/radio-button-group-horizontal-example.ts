import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

/**
 * @title Radio Button Group Horizontal
 * @order 20
 */
@Component({
  selector: 'sbb-radio-button-group-horizontal-example',
  templateUrl: 'radio-button-group-horizontal-example.html',
  standalone: true,
  imports: [SbbRadioButtonModule, FormsModule],
})
export class RadioButtonGroupHorizontalExample {
  modelValue: string = 'value1';

  radioOptions = [
    {
      name: 'Radio 1',
      value: 'value1',
    },
    {
      name: 'Radio 2',
      value: 'value2',
    },
    {
      name: 'Radio 3',
      value: 'value3',
    },
  ];
}
