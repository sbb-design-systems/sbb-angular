import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-form-field-select-example',
  templateUrl: './form-field-select-example.component.html',
})
export class FormFieldSelectExampleComponent {
  select: FormControl = new FormControl('', [Validators.required]);
}
