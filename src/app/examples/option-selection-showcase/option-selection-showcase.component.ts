import { Component } from '@angular/core';

@Component({
  selector: 'sbb-option-selection-showcase',
  templateUrl: './option-selection-showcase.component.html',
  styleUrls: ['./option-selection-showcase.component.scss']
})
export class OptionSelectionShowcaseComponent {

  required: boolean;
  disabled: boolean;
  checked: boolean;
  modelValue = 'value1';

  radioOptions = [{
    'name': 'Radio 1',
    'value': 'value1'
  }, {
    'name': 'Radio 2',
    'value': 'value2'
  }, {
    'name': 'Radio 3',
    'value': 'value3'
  }];

}
