import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-native',
  templateUrl: './select-native.component.html',
  styleUrls: ['./select-native.component.scss']
})
export class SelectNativeComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false
    });
  }
}
