import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbProcessflowModule } from '@sbb-esta/angular/processflow';

/**
 * @title Processflow with editable steps
 * @order 30
 */
@Component({
  selector: 'sbb-processflow-editable-example',
  templateUrl: 'processflow-editable-example.html',
  styleUrls: ['processflow-editable-example.css'],
  imports: [
    SbbProcessflowModule,
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbButtonModule,
    SbbCheckboxModule,
  ],
})
export class ProcessflowEditableExample {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  disableEditable = true;
}
