import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SbbRadioChange } from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-toggle-example',
  templateUrl: './toggle-example.component.html',
  styleUrls: ['./toggle-example.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ToggleExampleComponent implements OnInit {
  modelValue = 'Option_1';
  modelReactive = 'Option_2';

  toggleValues: any;

  form = new FormGroup({
    test: new FormControl(),
  });

  ngOnInit() {
    this.form.get('test')!.valueChanges.subscribe((val) => {
      this.modelReactive = val;
    });
  }

  change(toggleValues: SbbRadioChange) {
    this.toggleValues = toggleValues.value;
  }
}
