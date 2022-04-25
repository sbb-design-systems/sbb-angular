import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

/**
 * @title Tag Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-tag-reactive-forms-example',
  templateUrl: 'tag-reactive-forms-example.html',
})
export class TagReactiveFormsExample {
  formGroup = this._formBuilder.group({
    trains: [true],
    cars: [true],
    bicycles: [false],
  });

  constructor(private _formBuilder: FormBuilder) {}
}
