import { Component } from '@angular/core';

@Component({
  selector: 'sbb-radio-button-showcase',
  templateUrl: './radio-button-showcase.component.html',
  styleUrls: ['./radio-button-showcase.component.scss']
})
export class RadioButtonShowcaseComponent {

  required: boolean;
  disabled: boolean;
  checked: boolean;
  modelValue = 'pizza';

  radioOptions = [{
    'name': 'Pizza',
    'value': 'pizza'
  }, {
    'name': 'Pasta',
    'value': 'pasta'
  }, {
    'name': 'Mandolino',
    'value': 'mandolino'
  }];

}
