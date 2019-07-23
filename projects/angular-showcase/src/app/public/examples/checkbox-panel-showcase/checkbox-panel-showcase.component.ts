import { Component } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-panel-showcase',
  templateUrl: './checkbox-panel-showcase.component.html',
  styleUrls: ['./checkbox-panel-showcase.component.scss']
})
export class CheckboxPanelShowcaseComponent {
  required2: boolean;
  disabled2: boolean;
  checked2: boolean;
  modelValue2 = 'value1';

  checkboxOptions = [
    {
      name: 'Check 1',
      value: 'value1',
      selected: true
    },
    {
      name: 'Check 2',
      value: 'value2',
      selected: false
    },
    {
      name: 'Check 3',
      value: 'value3',
      selected: false
    }
  ];
}
