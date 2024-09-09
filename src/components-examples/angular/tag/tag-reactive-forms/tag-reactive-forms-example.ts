import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbTagModule } from '@sbb-esta/angular/tag';

/**
 * @title Tag Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-tag-reactive-forms-example',
  templateUrl: 'tag-reactive-forms-example.html',
  standalone: true,
  imports: [SbbTagModule, FormsModule, ReactiveFormsModule, JsonPipe],
})
export class TagReactiveFormsExample {
  private _formBuilder = inject(FormBuilder);

  formGroup = this._formBuilder.group({
    trains: [true],
    cars: [true],
    bicycles: [false],
  });
}
