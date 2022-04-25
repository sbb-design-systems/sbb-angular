import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * @title Processflow overview
 * @order 10
 */
@Component({
  selector: 'sbb-processflow-overview-example',
  templateUrl: 'processflow-overview-example.html',
  styleUrls: ['processflow-overview-example.css'],
})
export class ProcessflowOverviewExample {
  linear = true;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}
}
