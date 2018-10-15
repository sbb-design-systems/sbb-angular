import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-field-showcase',
  templateUrl: './sbb-field-showcase.component.html',
  styleUrls: ['./sbb-field-showcase.component.scss']
})
export class SbbFieldShowcaseComponent implements OnInit {

  valueFromInput1 = '';
  valueFromInput2 = '';
  valueFromInput3 = '';

  myForm1: FormGroup;
  myForm2: FormGroup;
  myForm3: FormGroup;

  header1 = '1. SBB-Label with Input';
  header2 = '2. SBB-Label with opt. Text, Tooltip and Input';
  header3 = '3. SBB-Field with Label';

  inputType = this.header1;
  types = [
    this.header1,
    this.header2,
    this.header3
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.myForm1 = this.formBuilder.group({
      name1: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      name2: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.myForm3 = this.formBuilder.group({
      name3: ['', Validators.required]
    });
  }

  reset1() {
    this.myForm1.reset();
    this.valueFromInput1 = '';
  }

  reset2() {
    this.myForm2.reset();
    this.valueFromInput2 = '';
  }

  reset3() {
    this.myForm3.reset();
    this.valueFromInput3 = '';
  }

  onKeyEnter1(event: any) {
    this.valueFromInput1 = event.target.value;
  }

  onKeyEnter2(event: any) {
    this.valueFromInput2 = event.target.value;
  }

  onKeyEnter3(event: any) {
    this.valueFromInput3 = event.target.value;
  }

}
