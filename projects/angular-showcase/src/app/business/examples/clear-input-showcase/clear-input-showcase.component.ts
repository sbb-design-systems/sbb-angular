import { Subject } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-clear-input-showcase',
  templateUrl: './clear-input-showcase.component.html',
  styleUrls: ['./clear-input-showcase.component.scss']
})
export class ClearInputShowcaseComponent implements OnInit {
  form: FormGroup;

  name = 'John';
  inputMode = 'medium';

  options$: Subject<string[]>;
  searchNumbers: Subject<string>;
  options: string[] = [
    'Rome',
    'Zürich',
    'Frankfurt',
    'Bern',
    'Madrid',
    'Paris',
    'London',
    'Prague',
    'Amsterdam',
    'Berlin'
  ];
  filter: '';
  filteredOptions = this.options.slice(0);

  modes = ['default', 'short', 'medium', 'long'];
  dateArrows = true;
  disabled = false;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['John'],
      birthDate: [new Date()],
      city: ['Rome'],
      plz: ['63065']
    });

    this.form.valueChanges.subscribe(newValue => {
      if (newValue.city !== this.form.get('city')) {
        this.filteredOptions = this.options.filter(
          option => option.toLocaleLowerCase().indexOf(newValue.city.toLocaleLowerCase()) > -1
        );
      }
    });

    this.options$ = new Subject<string[]>();
  }

  onDisableChange() {
    this.disabled ? this.form.disable() : this.form.enable();
  }
}
