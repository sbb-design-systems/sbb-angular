import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

/**
 * @title Processflow with editable steps
 * @order 30
 */
@Component({
  selector: 'sbb-processflow-editable-example',
  templateUrl: 'processflow-editable-example.html',
  styleUrls: ['processflow-editable-example.css'],
})
export class ProcessflowEditableExample implements OnInit {
  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;
  disableEditable = true;

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
}
