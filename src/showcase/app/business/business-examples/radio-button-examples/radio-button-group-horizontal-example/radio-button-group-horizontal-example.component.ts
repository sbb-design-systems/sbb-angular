import { Component } from '@angular/core';

@Component({
  selector: 'sbb-radio-button-group-horizontal-example',
  templateUrl: './radio-button-group-horizontal-example.component.html',
})
export class RadioButtonGroupHorizontalExampleComponent {
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
