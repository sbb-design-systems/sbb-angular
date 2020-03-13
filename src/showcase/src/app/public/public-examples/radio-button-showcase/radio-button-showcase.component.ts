import { Component } from '@angular/core';

@Component({
  selector: 'sbb-radio-button-showcase',
  templateUrl: './radio-button-showcase.component.html',
  styleUrls: ['./radio-button-showcase.component.css']
})
export class RadioButtonShowcaseComponent {
  required: boolean;
  disabled: boolean;
  checked: boolean;
  modelValue = 'value1';

  radioOptions = [
    {
      name: 'Radio 1',
      value: 'value1'
    },
    {
      name: 'Radio 2',
      value: 'value2'
    },
    {
      name: 'Radio 3',
      value: 'value3'
    }
  ];
}
