import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-toggle-showcase',
  templateUrl: './toggle-showcase.component.html',
  styleUrls: ['./toggle-showcase.component.scss']
})
export class ToggleShowcaseComponent implements OnInit {

  modelValue = 'value1';
  modelReactive = 'value1';

  toggleOptions = [{
    'label': 'Toggle 1',
    'value': 'value1'
  }, {
    'label': 'Toggle 2',
    'value': 'value2'
  }];

  form = new FormGroup({
    test: new FormControl()
  });

  constructor() { }

  ngOnInit() {
    this.form.get('test').valueChanges.subscribe(
      (val) => {
        this.modelReactive = val;
      }
    );

  }

}
