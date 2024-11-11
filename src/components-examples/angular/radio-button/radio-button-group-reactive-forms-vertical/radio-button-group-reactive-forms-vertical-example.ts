import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

/**
 * @title Radio Button Group Reactive Forms Vertical
 * @order 30
 */
@Component({
  selector: 'sbb-radio-button-group-reactive-forms-vertical-example',
  templateUrl: 'radio-button-group-reactive-forms-vertical-example.html',
  imports: [SbbRadioButtonModule, FormsModule, ReactiveFormsModule],
})
export class RadioButtonGroupReactiveFormsVerticalExample {
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
