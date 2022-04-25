import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

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
  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;

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
