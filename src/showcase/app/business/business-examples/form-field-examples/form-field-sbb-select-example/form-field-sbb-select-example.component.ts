import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-form-field-sbb-select-example',
  templateUrl: './form-field-sbb-select-example.component.html',
})
export class FormFieldSbbSelectExampleComponent {
  select: FormControl = new FormControl('', [Validators.required]);
}
