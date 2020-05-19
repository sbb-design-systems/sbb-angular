import { Component } from '@angular/core';

@Component({
  selector: 'sbb-radio-button-example',
  templateUrl: './radio-button-example.component.html',
})
export class RadioButtonExampleComponent {
  required: boolean;
  disabled: boolean;
  checked: boolean;
}
