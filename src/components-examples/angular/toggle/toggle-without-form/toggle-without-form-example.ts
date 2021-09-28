import { Component, ViewEncapsulation } from '@angular/core';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';

/**
 * @title Toggle Without Form
 * @order 30
 */
@Component({
  selector: 'sbb-toggle-without-form-example',
  templateUrl: './toggle-without-form-example.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleWithoutFormExample {
  toggleValues: any = null;

  change(radioChange: SbbRadioChange) {
    this.toggleValues = radioChange.value;
  }
}
