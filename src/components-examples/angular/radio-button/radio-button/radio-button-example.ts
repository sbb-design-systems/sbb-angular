import { Component } from '@angular/core';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';

/**
 * @title Radio Button
 * @order 10
 */
@Component({
  selector: 'sbb-radio-button-example',
  templateUrl: './radio-button-example.html',
})
export class RadioButtonExample {
  disabled: boolean;
  value: string;

  change(radioChange: SbbRadioChange) {
    this.value = radioChange.value;
    console.log(radioChange);
  }
}
