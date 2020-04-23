import { Component } from '@angular/core';

@Component({
  selector: 'sbb-select-forms-example',
  templateUrl: './select-forms-example.component.html'
})
export class SelectFormsExampleComponent {
  value: string;
  disabled = false;
  optionDisabled = false;
}
