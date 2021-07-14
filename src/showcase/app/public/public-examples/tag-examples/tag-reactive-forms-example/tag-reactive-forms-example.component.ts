import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-tag-reactive-forms-example',
  templateUrl: './tag-reactive-forms-example.component.html',
})
export class TagReactiveFormsExampleComponent {
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      trains: [true],
      cars: [true],
      bicycles: [false],
    });
  }
}
