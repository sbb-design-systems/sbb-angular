import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RadioChange } from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-toggle-showcase',
  templateUrl: './toggle-showcase.component.html',
  styleUrls: ['./toggle-showcase.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToggleShowcaseComponent implements OnInit {
  modelValue = 'Option_1';
  modelReactive = 'Option_2';

  toggleValues: any;

  form = new FormGroup({
    test: new FormControl()
  });

  ngOnInit() {
    this.form.get('test')!.valueChanges.subscribe(val => {
      this.modelReactive = val;
    });
  }

  change(toggleValues: RadioChange) {
    this.toggleValues = toggleValues.value;
  }
}
