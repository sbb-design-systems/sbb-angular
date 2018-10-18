import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-showcase',
  templateUrl: './checkbox-showcase.component.html',
  styleUrls: ['./checkbox-showcase.component.scss']
})
export class CheckboxShowcaseComponent  {

  required: boolean;
  disabled: boolean;
  checked: boolean;

  checkboxOptions = [{
    'name': 'Check 1',
    'value': 'value1',
    'selected': true
  }, {
    'name': 'Check 2',
    'value': 'value2',
    'selected': false
  }, {
    'name': 'Check 3',
    'value': 'value3',
    'selected': false
  }];

}
