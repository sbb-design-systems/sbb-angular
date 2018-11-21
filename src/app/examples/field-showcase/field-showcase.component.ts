import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-field-showcase',
  templateUrl: './field-showcase.component.html',
  styleUrls: ['./field-showcase.component.scss']
})
export class SbbFieldShowcaseComponent implements OnInit {
  /**
   * Class property that refers to the first input field
   */
  inputText1 = '';
   /**
   * Class property that refers to the second input field
   */
  inputText2 = '';
  /**
   * Class property that refers to the third input field
   */
  inputText3 = '';

  /**
   * Class property that disable input field
   */
  disabled: boolean;

  /**
   * Class property that refers to the first form group
   */
  myForm1: FormGroup;
  /**
   * Class property that refers to the second form group
   */
  myForm2: FormGroup;
  /**
   * Class property that refers to the third form group
   */
  myForm3: FormGroup;
  /**
   * Class property that sets placeholder at all input field
   */
  placeholder = 'Please enter your name ...';

  /**
   * Class property that refers to the first form group header
   */
  header1 = '1. SBB-Field without Attribute Label';
  /**
   * Class property that refers to the second form group header
   */
  header2 = '2. SBB-Field with SBB-Label, Text and Input';
  /**
   * Class property that refers to the third form group header
   */
  header3 = '3. SBB-Field with Attribute Label';

  /**
   * Class property that sets input field to the first header
   */
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
   * Method that verify if a child element (in this case: input field) of a form group is disable
   */
  disableForms() {
    const control1 = this.myForm1.get('name1');
    control1.disabled ? control1.enable() : control1.disable();

    const control2 = this.myForm2.get('name2');
    control2.disabled ? control2.enable() : control2.disable();

    const control3 = this.myForm3.get('name3');
    control3.disabled ? control3.enable() : control3.disable();
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
