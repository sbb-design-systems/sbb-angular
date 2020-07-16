import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-radio-button-group-reactive-forms-example',
  templateUrl: './radio-button-group-reactive-forms-example.component.html',
})
export class RadioButtonGroupReactiveFormsExampleComponent {
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
  radioGroup: FormControl = new FormControl('value1');
}
