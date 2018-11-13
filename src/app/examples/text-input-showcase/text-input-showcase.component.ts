import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase',
  templateUrl: './text-input-showcase.component.html',
  styleUrls: ['./text-input-showcase.component.scss']
})
export class InputFieldShowcaseComponent implements OnInit {

  placeholderText = 'Please enter your text ...';
  placeholderPassword = 'Please enter a password ...';
  placeholderNumber = 'Please enter a number ...';
  placeholderEmail = 'Please enter a email ...';
  placeholderDatetime = 'Please enter a datetime ...';

  inputText = '';
  disabled: boolean;
  required: boolean;
  isVisible = true;
  readonly: boolean;
  inputType = 'text';
  placeholder = 'Please enter your text ...';
  types = [
    'text',
    'password',
    'number',
    'file',
    'email',
    'datetime',
    'datetime-local'
  ];

  ngOnInit() {
  }

  clearInput() {
    this.inputText = null;
  }

  onChange(event) {
    if(event === 'text') {
       this.placeholder = this.placeholderText;
    }
    if(event === 'password') {
       this.placeholder = this.placeholderPassword;
    }
    if(event === 'number') {
       this.placeholder = this.placeholderNumber;
    }
    if(event === 'email') {
      this.placeholder = this.placeholderEmail;
    }
    if(event === 'datetime') {
      this.placeholder = this.placeholderDatetime;
    }
  }

}
