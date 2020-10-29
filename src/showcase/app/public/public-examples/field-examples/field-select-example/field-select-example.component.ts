import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-field-select-example',
  templateUrl: './field-select-example.component.html',
})
export class FieldSelectExampleComponent {
  select: FormControl = new FormControl('', [Validators.required]);
}
