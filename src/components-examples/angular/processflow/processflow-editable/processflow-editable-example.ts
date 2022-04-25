import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * @title Processflow with editable steps
 * @order 30
 */
@Component({
  selector: 'sbb-processflow-editable-example',
  templateUrl: 'processflow-editable-example.html',
  styleUrls: ['processflow-editable-example.css'],
})
export class ProcessflowEditableExample {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  disableEditable = true;

  constructor(private _formBuilder: FormBuilder) {}
}
