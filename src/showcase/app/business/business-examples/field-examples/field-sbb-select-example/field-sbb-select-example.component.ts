import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-field-sbb-select-example',
  templateUrl: './field-sbb-select-example.component.html',
})
export class FieldSbbSelectExampleComponent {
  select: FormControl = new FormControl('', [Validators.required]);
}
