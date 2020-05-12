import { Component } from '@angular/core';

@Component({
  selector: 'sbb-radio-button-example',
  templateUrl: './radio-button-example.component.html',
  styleUrls: ['./radio-button-example.component.css'],
})
export class RadioButtonExampleComponent {
  required: boolean;
  disabled: boolean;
  checked: boolean;
  modelValue = 'value1';

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
