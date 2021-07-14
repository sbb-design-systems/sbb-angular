import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * @title Tag Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-tag-reactive-forms-example',
  templateUrl: './tag-reactive-forms-example.html',
})
export class TagReactiveFormsExample {
  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      trains: [true],
      cars: [true],
      bicycles: [false],
    });
  }
}
