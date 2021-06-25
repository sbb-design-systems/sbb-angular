import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title Processflow overview
 * @order 10
 */
@Component({
  selector: 'sbb-processflow-overview-example',
  templateUrl: 'processflow-overview-example.html',
  styleUrls: ['processflow-overview-example.css'],
})
export class ProcessflowOverviewExample implements OnInit {
  linear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
}
