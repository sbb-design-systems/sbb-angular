import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-radio-button-panel-group-example',
  templateUrl: './radio-button-panel-group-example.component.html',
})
export class RadioButtonPanelGroupExampleComponent {
  radioOptions = [
    {
      name: 'Option 1',
      value: 'value1',
    },
    {
      name: 'Option 2',
      value: 'value2',
    },
    {
      name: 'Option 3',
      value: 'value3',
    },
  ];
  radioGroup: FormControl = new FormControl('value1');
}
