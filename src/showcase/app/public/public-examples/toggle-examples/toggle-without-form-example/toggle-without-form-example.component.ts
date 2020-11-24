import { Component, ViewEncapsulation } from '@angular/core';
import { SbbRadioChange } from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-toggle-without-form-example',
  templateUrl: './toggle-without-form-example.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleWithoutFormExampleComponent {
  toggleValues: any;

  change(radioChange: SbbRadioChange) {
    this.toggleValues = radioChange.value;
  }
}
