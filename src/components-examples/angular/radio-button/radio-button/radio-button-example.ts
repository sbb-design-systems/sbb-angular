import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

/**
 * @title Radio Button
 * @order 10
 */
@Component({
  selector: 'sbb-radio-button-example',
  templateUrl: 'radio-button-example.html',
  imports: [SbbRadioButtonModule, SbbCheckboxModule, FormsModule, JsonPipe],
})
export class RadioButtonExample {
  disabled: boolean;
  value: string;

  change(radioChange: SbbRadioChange) {
    this.value = radioChange.value;
    console.log(radioChange);
  }
}
