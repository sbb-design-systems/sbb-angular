import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

/**
 * @title Tag Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-tag-reactive-forms-example',
  templateUrl: 'tag-reactive-forms-example.html',
})
export class TagReactiveFormsExample {
  formGroup: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      trains: [true],
      cars: [true],
      bicycles: [false],
    });
  }
}
