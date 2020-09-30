import { Component } from '@angular/core';
import { SbbRadioChange } from '@sbb-esta/angular-business/radio-button';

@Component({
  selector: 'sbb-radio-button-example',
  templateUrl: './radio-button-example.component.html',
})
export class RadioButtonExampleComponent {
  disabled: boolean;
  value: string;

  change(radioChange: SbbRadioChange) {
    this.value = radioChange.value;
    console.log(radioChange);
  }
}
