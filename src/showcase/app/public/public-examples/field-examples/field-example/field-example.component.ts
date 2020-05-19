import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckboxChange } from '@sbb-esta/angular-public/checkbox';

@Component({
  selector: 'sbb-field-example',
  templateUrl: './field-example.component.html',
})
export class FieldExampleComponent implements OnInit {
  form: FormGroup;

  inputMode = 'default';
  modes = ['default', 'short', 'medium', 'long'];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      name1: ['', Validators.required],
      name2: ['', [Validators.required, Validators.minLength(3)]],
      select1: ['', Validators.required],
      select2: [undefined, Validators.required],
      date: [new Date()],
    });
  }

  toggleDisabled(sbbCheckboxChange: CheckboxChange) {
    Object.keys(this.form.controls)
      .map((n) => this.form.get(n)!)
      .forEach((c) => (sbbCheckboxChange.checked ? c.disable() : c.enable()));
  }

  reset() {
    this.form.reset();
  }
}
