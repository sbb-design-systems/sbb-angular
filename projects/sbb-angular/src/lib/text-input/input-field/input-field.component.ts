import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {

  inputForm: FormGroup;

  @Input() placeholder: string;
  @Input() label: string;
  @Input() optional?: string;
  @Input() toolTip?: string;
  @Input() maxLength?: string;
  @Input() size?: string;
  @Input() inputType: string;
  @Input() pattern?: string;

  value: string;

  model: any = {};

  isPasswordInputField: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.inputForm = this.formBuilder.group({
      input:['', Validators.required]
    });

    this.value = '';

    if(!this.label) {
        this.label = 'Label is missing.';
    }

    if(this.optional) {
       this.optional = '"' + this.optional + '"';
    }

    if(!this.maxLength) {
      this.maxLength = '25';
    }

    if(!this.size) {
        this.size = '25';
    }

    if(new RegExp('password', 'ig').test(this.inputType)) {
       this.isPasswordInputField = true;
    }

    console.log('pattern', this.pattern);

  }

  onMouseEnter(value : string) {
    console.log('value', value);
  }

  onFocusIn(event) {
    event.target.value = this.value;
  }

  onFocusOut(event) {
    this.value = event.target.value;
    const value = event.target.value;
    const size = event.target.size;
    if(event.target.value.length > event.target.size) {
       event.target.value = value.substring(0, size-3) + '...';
    }
  }
}
