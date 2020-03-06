import { Component } from '@angular/core';

@Component({
  selector: 'sbb-select-forms',
  templateUrl: './select-forms.component.html'
})
export class SelectFormsComponent {
  value: string;
  disabled = false;
  optionDisabled = false;
}
