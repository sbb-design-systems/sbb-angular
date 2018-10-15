import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase',
  templateUrl: './input-field-showcase.component.html',
  styleUrls: ['./input-field-showcase.component.scss']
})
export class InputFieldShowcaseComponent implements OnInit {

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
       this.placeholder = 'Please enter your text ...';
    }
    if(event === 'password') {
       this.placeholder = 'Please enter a password ...';
    }
    if(event === 'number') {
       this.placeholder = 'Please enter a number ...';
    }
    if(event === 'email') {
      this.placeholder = 'Please enter a email ...';
    }
    if(event === 'datetime') {
      this.placeholder = 'Please enter a datetime ...';
    }
  }

}
