import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-field-showcase',
  templateUrl: './field-showcase.component.html',
  styleUrls: ['./field-showcase.component.scss']
})
export class FieldShowcaseComponent implements OnInit {

  inputText1 = '';
  inputText2 = '';
  inputText3 = '';

  myForm1: FormGroup;
  myForm2: FormGroup;
  myForm3: FormGroup;

  placeholder = 'Please enter your name ...';

  header1 = '1. SBB-Field without Attribute Label';
  header2 = '2. SBB-Field with SBB-Label, Text and Input';
  header3 = '3. SBB-Field with Attribute Label';

  inputType = this.header1;
  types = [
    this.header1,
    this.header2,
    this.header3
  ];

  inputMode = 'default';
  modes = [
    'default',
    'short',
    'medium',
    'long'
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.myForm1 = this.formBuilder.group({
      name1: new FormControl({ disabled: false }, Validators.required)
    });
    this.myForm2 = this.formBuilder.group({
      name2: new FormControl({ disabled: false }, [Validators.required, Validators.minLength(3)])
    });
    this.myForm3 = this.formBuilder.group({
      name3: new FormControl({ disabled: false }, Validators.required)
    });

    this.myForm1.reset();
    this.myForm2.reset();
    this.myForm3.reset();

  }
  /**
   * Method that verify if a child element (in this case: input field) of a form group is disabled
   */
  disableForms(evt) {
    const control1 = this.myForm1.get('name1');
    evt.target.checked ? control1.disable() : control1.enable();

    const control2 = this.myForm2.get('name2');
    evt.target.checked ? control2.disable() : control2.enable();

    const control3 = this.myForm3.get('name3');
    evt.target.checked ? control3.disable() : control3.enable();
  }
  /**
   * Method that reset the first input field
   */
  reset1() {
    this.myForm1.reset();
    this.inputText1 = '';
  }

  /**
   * Method that reset the second input field
   */
  reset2() {
    this.myForm2.reset();
    this.inputText2 = '';
  }

  /**
   * Method that reset the third input field
   */
  reset3() {
    this.myForm3.reset();
    this.inputText3 = '';
  }

}
