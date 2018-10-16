import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-radio-button-showcase',
  templateUrl: './radio-button-showcase.component.html',
  styleUrls: ['./radio-button-showcase.component.scss']
})
export class RadioButtonShowcaseComponent implements OnInit {

  required: boolean;
  disabled: boolean;
  checked: boolean;
  modelValue: string;

  radioOptions = [{
    'name': 'Pizza',
    'value': 'pizza'
  }, {
    'name': 'Pasta',
    'value': 'pasta'
  }, {
    'name': 'Mandolino',
    'value': 'mandolino'
  }];

  reactiveForm = new FormGroup({
    reactiveValue: new FormControl('pizza')
  });

  ngOnInit(): void {
    this.modelValue = 'pizza';
   // throw new Error("Method not implemented.");
  }

  change(optionValue) {
    this.modelValue = optionValue;
  }

}
