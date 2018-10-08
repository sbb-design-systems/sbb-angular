import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-field-showcase',
  templateUrl: './text-field-showcase.component.html',
  styleUrls: ['./text-field-showcase.component.scss']
})
export class TextFieldShowcaseComponent implements OnInit {

  valueFromInput1 = '';
  valueFromInput2 = '';

  myForm1: FormGroup;
  myForm2: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.myForm1 = this.formBuilder.group({
      name1: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      name2: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onKeyEnter1(event: any) {
    this.valueFromInput1 = event.target.value;
  }

  onKeyEnter2(event: any) {
    this.valueFromInput2 = event.target.value;
  }

}
