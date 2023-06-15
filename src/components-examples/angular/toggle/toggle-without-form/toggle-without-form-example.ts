import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';
import { SbbToggleModule } from '@sbb-esta/angular/toggle';

/**
 * @title Toggle Without Form
 * @order 30
 */
@Component({
  selector: 'sbb-toggle-without-form-example',
  templateUrl: 'toggle-without-form-example.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [SbbToggleModule, JsonPipe],
})
export class ToggleWithoutFormExample {
  toggleValues: any = null;

  change(radioChange: SbbRadioChange) {
    this.toggleValues = radioChange.value;
  }
}
