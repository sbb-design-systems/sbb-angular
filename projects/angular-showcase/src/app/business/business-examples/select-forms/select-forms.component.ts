import { Component } from '@angular/core';

@Component({
  selector: 'sbb-select-forms',
  templateUrl: './select-forms.component.html',
  styleUrls: ['./select-forms.component.scss']
})
export class SelectFormsComponent {
  value: string;
  disabled = false;
  optionDisabled = false;
}
